import { createContext, useContext } from "react";

// =========================================================
// CONTEXT DEFINITIONS
// =========================================================
export const CartContext = createContext();
export const AuthContext = createContext();
export const ProductContext = createContext();
export const ToastContext = createContext();
export const UIContext = createContext();
export const WishlistContext = createContext(); // Legacy backwards compatibility

// =========================================================
// HOOKS CONSUMERS
// =========================================================
export const useCart = () => useContext(CartContext);
export const useAuth = () => useContext(AuthContext);
export const useProducts = () => useContext(ProductContext);
export const useToast = () => useContext(ToastContext);
export const useUI = () => useContext(UIContext);
export const useWishlist = () => useContext(WishlistContext);
