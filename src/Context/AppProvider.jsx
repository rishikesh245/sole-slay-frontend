import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { getProducts } from "../api/productApi";
import {
  CartContext,
  AuthContext,
  ProductContext,
  ToastContext,
  UIContext,
  WishlistContext,
} from "./Context";

// User-segmented cart key helper
const getCartKey = (u) =>
  u?.id ? `sole_slay_cart_user_${u.id}` : "sole_slay_cart_guest";

// =========================================================
// UNIFIED REAL-TIME APP PROVIDER
// =========================================================
export function AppProvider({ children }) {
  // -------------------------------------------------------
  // 1. TOAST NOTIFICATION STATE (Real-time floating alerts)
  // -------------------------------------------------------
  const [toasts, setToasts] = useState([]);
  const lastToastRef = useRef({ message: "", time: 0 });

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "success", duration = 2800) => {
      const now = Date.now();
      // Deduplicate identical toasts fired within 450ms (prevents double triggers from React StrictMode or double clicks)
      if (
        lastToastRef.current.message === message &&
        now - lastToastRef.current.time < 450
      ) {
        return;
      }
      lastToastRef.current = { message, time: now };

      const id = now + Math.random();
      setToasts((prev) => [...prev.slice(-3), { id, message, type }]);
      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  const toastContextValue = useMemo(
    () => ({ toasts, showToast, removeToast }),
    [toasts, showToast, removeToast]
  );

  // -------------------------------------------------------
  // 2. AUTH & USER STATE
  // -------------------------------------------------------
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("token") || "";
    } catch {
      return "";
    }
  });

  const [showLogin, setShowLogin] = useState(false);

  // -------------------------------------------------------
  // 3. CART STATE (User-Segmented, Variant-Aware, Real-Time)
  // -------------------------------------------------------
  const [cartItems, setCartItems] = useState(() => {
    try {
      const initialKey = getCartKey(user);
      const saved = localStorage.getItem(initialKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const login = useCallback(
    (userData, tokenString) => {
      setUser(userData);
      setToken(tokenString);
      try {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", tokenString);
      } catch {
        // Storage write error ignored
      }

      // Switch to logging-in user's cart
      try {
        const userCartKey = getCartKey(userData);
        const saved = localStorage.getItem(userCartKey);
        setCartItems(saved ? JSON.parse(saved) : []);
      } catch {
        setCartItems([]);
      }

      setShowLogin(false);
      showToast(`Welcome back, ${userData?.name || "Shoe Lover"}!`, "success");
    },
    [showToast]
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken("");
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } catch {
      // Storage remove error ignored
    }

    // Switch to guest cart
    try {
      const guestKey = getCartKey(null);
      const saved = localStorage.getItem(guestKey);
      setCartItems(saved ? JSON.parse(saved) : []);
    } catch {
      setCartItems([]);
    }

    showToast("Logged out successfully.", "info");
  }, [showToast]);

  const openLogin = useCallback(() => setShowLogin(true), []);
  const closeLogin = useCallback(() => setShowLogin(false), []);
  const isAdmin = Boolean(user?.role === "admin");

  const authContextValue = useMemo(
    () => ({
      user,
      setUser,
      token,
      setToken,
      showLogin,
      setShowLogin,
      openLogin,
      closeLogin,
      login,
      logout,
      isAdmin,
    }),
    [user, token, showLogin, openLogin, closeLogin, login, logout, isAdmin]
  );

  // Auto-sync active cart to localStorage under user-segmented key
  useEffect(() => {
    const currentKey = getCartKey(user);
    try {
      localStorage.setItem(currentKey, JSON.stringify(cartItems));
    } catch {
      console.warn("Storage quota exceeded for cart");
    }
  }, [cartItems, user]);

  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => acc + (Number(item.quantity) || 1),
      0
    );
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce(
      (acc, item) =>
        acc + Number(item.price || 0) * (Number(item.quantity) || 1),
      0
    );
  }, [cartItems]);

  const addToCart = useCallback(
    (product, qty = 1, size = "7") => {
      if (!user) {
        openLogin();
        showToast("Please log in to add items to your cart.", "info");
        return false;
      }

      const availableStock =
        product.stock !== undefined ? Number(product.stock) : 10;

      if (availableStock <= 0) {
        showToast(`Sorry, "${product.name}" is currently out of stock.`, "error");
        return false;
      }

      const requestedSize = String(size || "7").trim();
      const requestedQty = Math.max(1, Number(qty) || 1);

      const primaryImg =
        (Array.isArray(product.images) && product.images[0]?.image_url) ||
        (Array.isArray(product.images) && typeof product.images[0] === "string"
          ? product.images[0]
          : product.image) ||
        "";

      // Variant matching: distinguish same shoe in different sizes
      const existingItem = cartItems.find(
        (item) =>
          item.id === product.id &&
          String(item.selectedSize || "7").trim() === requestedSize
      );

      if (existingItem) {
        const currentQty = Number(existingItem.quantity) || 1;

        if (currentQty >= availableStock) {
          showToast(
            `Maximum available stock (${availableStock}) reached for ${product.name} (UK ${requestedSize}).`,
            "info"
          );
          return false;
        }

        const newQty = Math.min(currentQty + requestedQty, availableStock);
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === product.id &&
            String(item.selectedSize || "7").trim() === requestedSize
              ? { ...item, quantity: newQty, stock: availableStock }
              : item
          )
        );
        showToast(
          `Updated ${product.name} (UK ${requestedSize}) quantity to ${newQty}.`,
          "success"
        );
        return true;
      }

      const newQty = Math.min(requestedQty, availableStock);
      const newItem = {
        cartItemId: `${product.id}_${requestedSize}`,
        id: product.id,
        name: product.name,
        price: Number(product.price) || 0,
        image: primaryImg,
        quantity: newQty,
        stock: availableStock,
        selectedSize: requestedSize,
      };

      setCartItems((prev) => [...prev, newItem]);
      showToast(
        `${product.name} (UK ${requestedSize}) added to cart!`,
        "success"
      );
      return true;
    },
    [user, cartItems, openLogin, showToast]
  );

  const removeFromCart = useCallback(
    (cartItemIdOrId) => {
      const itemToRemove = cartItems.find(
        (item) =>
          item.cartItemId === cartItemIdOrId || item.id === cartItemIdOrId
      );
      if (itemToRemove) {
        showToast(`Removed "${itemToRemove.name}" from cart.`, "info");
      }
      setCartItems((prev) =>
        prev.filter(
          (item) =>
            item.cartItemId !== cartItemIdOrId && item.id !== cartItemIdOrId
        )
      );
    },
    [cartItems, showToast]
  );

  const increaseQuantity = useCallback(
    (cartItemIdOrId) => {
      const targetItem = cartItems.find(
        (item) =>
          item.cartItemId === cartItemIdOrId || item.id === cartItemIdOrId
      );
      if (!targetItem) return;

      const maxStock = Number(targetItem.stock) || 10;
      const currentQty = Number(targetItem.quantity) || 1;

      if (currentQty >= maxStock) {
        showToast(
          `Maximum stock limit reached (${maxStock} pairs available).`,
          "error"
        );
        return;
      }

      setCartItems((prev) =>
        prev.map((item) =>
          item.cartItemId === cartItemIdOrId || item.id === cartItemIdOrId
            ? { ...item, quantity: currentQty + 1 }
            : item
        )
      );
    },
    [cartItems, showToast]
  );

  const decreaseQuantity = useCallback((cartItemIdOrId) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (
            item.cartItemId !== cartItemIdOrId &&
            item.id !== cartItemIdOrId
          ) {
            return item;
          }
          return {
            ...item,
            quantity: (Number(item.quantity) || 1) - 1,
          };
        })
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartContextValue = useMemo(
    () => ({
      cartItems,
      setCartItems,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
    }),
    [
      cartItems,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
    ]
  );

  // -------------------------------------------------------
  // 4. PRODUCT & REAL-TIME FILTER STATE (In-Memory Cache)
  // -------------------------------------------------------
  const [allProducts, setAllProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [subcategory, setSubcategory] = useState("");
  const [price, setPrice] = useState("All");

  const loadProducts = useCallback((forceRefresh = false) => {
    if (forceRefresh) {
      setLoadingProducts(true);
    }
    return getProducts("All", "", forceRefresh)
      .then((res) => {
        setAllProducts(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
      })
      .finally(() => {
        setLoadingProducts(false);
      });
  }, []);

  useEffect(() => {
    let active = true;
    getProducts("All", "", false)
      .then((res) => {
        if (active) {
          setAllProducts(res.data || []);
        }
      })
      .catch((err) => {
        if (active) {
          console.error("Failed to fetch products:", err);
        }
      })
      .finally(() => {
        if (active) {
          setLoadingProducts(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const refreshProducts = useCallback(() => {
    return loadProducts(true);
  }, [loadProducts]);

  const clearFilters = useCallback(() => {
    setCategory("All");
    setSubcategory("");
    setPrice("All");
    setSearchTerm("");
  }, []);

  // REAL-TIME INSTANT IN-MEMORY FILTERING (<0.1ms computation)
  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      // 1. Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchName = p.name?.toLowerCase().includes(term);
        const matchDesc = p.description?.toLowerCase().includes(term);
        const matchSub = p.Subcategory?.name?.toLowerCase().includes(term);
        if (!matchName && !matchDesc && !matchSub) return false;
      }

      // 2. Category
      if (category !== "All") {
        const catId =
          p.Subcategory?.Category?.id ||
          p.Subcategory?.category_id ||
          p.category_id ||
          p.category;
        if (String(catId) !== String(category)) return false;
      }

      // 3. Subcategory
      if (subcategory) {
        const subId = p.subcategory_id || p.Subcategory?.id;
        if (String(subId) !== String(subcategory)) return false;
      }

      // 4. Price range
      if (price !== "All") {
        const numP = Number(p.price);
        if (price === "under 2000" && numP >= 2000) return false;
        if (price === "2000-3000" && (numP < 2000 || numP > 3000)) return false;
        if (price === "above 3000" && numP <= 3000) return false;
      }

      return true;
    });
  }, [allProducts, searchTerm, category, subcategory, price]);

  const productContextValue = useMemo(
    () => ({
      allProducts,
      filteredProducts,
      loadingProducts,
      searchTerm,
      setSearchTerm,
      category,
      setCategory,
      subcategory,
      setSubcategory,
      price,
      setPrice,
      clearFilters,
      refreshProducts,
    }),
    [
      allProducts,
      filteredProducts,
      loadingProducts,
      searchTerm,
      category,
      subcategory,
      price,
      clearFilters,
      refreshProducts,
    ]
  );

  // -------------------------------------------------------
  // 5. UI STATE
  // -------------------------------------------------------
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);

  const uiContextValue = useMemo(
    () => ({
      sidebarOpen,
      setSidebarOpen,
      toggleSidebar,
    }),
    [sidebarOpen, toggleSidebar]
  );

  // Legacy backwards compatibility
  const wishlistContextValue = useMemo(
    () => ({
      wishlist: [],
      addToWishlist: () => {},
      removeFromWishlist: () => {},
      isInWishlist: () => false,
    }),
    []
  );

  return (
    <ToastContext.Provider value={toastContextValue}>
      <AuthContext.Provider value={authContextValue}>
        <UIContext.Provider value={uiContextValue}>
          <ProductContext.Provider value={productContextValue}>
            <CartContext.Provider value={cartContextValue}>
              <WishlistContext.Provider value={wishlistContextValue}>
                {children}
              </WishlistContext.Provider>
            </CartContext.Provider>
          </ProductContext.Provider>
        </UIContext.Provider>
      </AuthContext.Provider>
    </ToastContext.Provider>
  );
}

export const CartProvider = AppProvider;
export default AppProvider;
