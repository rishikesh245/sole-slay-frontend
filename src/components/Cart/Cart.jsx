import "./Cart.css";
import { useCart, useAuth } from "../../Context/Context";
import { useNavigate, Link } from "react-router-dom";
import {
  FaShoppingBag,
  FaTrashAlt,
  FaArrowRight,
  FaShieldAlt,
  FaTruck,
  FaLock,
  FaChevronLeft,
  FaPlus,
  FaMinus,
} from "react-icons/fa";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    cartTotal,
    cartCount,
    clearCart,
  } = useCart();
  const { user, openLogin } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      openLogin();
      return;
    }
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty-container">
          <div className="cart-empty-card">
            <div className="empty-cart-icon-wrap">
              <FaShoppingBag className="empty-cart-icon" />
            </div>
            <h2>Your Shopping Cart is Empty</h2>
            <p className="empty-cart-desc">
              Looks like you haven't added any luxury footwear to your cart yet.
              Discover our latest collection and elevate your sneaker rotation today!
            </p>
            <div className="empty-cart-actions">
              <button
                type="button"
                className="btn-start-shopping"
                onClick={() => navigate("/shop")}
              >
                Explore Collection <FaArrowRight />
              </button>
            </div>

            <div className="cart-empty-perks">
              <div className="perk-item">
                <FaTruck className="perk-icon" />
                <span>Free Express Shipping</span>
              </div>
              <div className="perk-item">
                <FaShieldAlt className="perk-icon" />
                <span>100% Authentic Footwear</span>
              </div>
              <div className="perk-item">
                <FaLock className="perk-icon" />
                <span>256-Bit Encrypted Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-wrapper">
        {/* TOP BAR / BREADCRUMB */}
        <div className="cart-header-bar">
          <div>
            <h1 className="cart-title">Shopping Cart</h1>
            <p className="cart-subtitle">
              You have <span className="cart-count-badge">{cartCount} {cartCount === 1 ? "pair" : "pairs"}</span> of premium shoes ready for checkout.
            </p>
          </div>
          <Link to="/shop" className="cart-continue-link">
            <FaChevronLeft /> Continue Shopping
          </Link>
        </div>

        {/* 2-COLUMN MAIN CONTENT */}
        <div className="cart-layout">
          {/* LEFT: CART ITEMS LIST */}
          <div className="cart-items-section">
            <div className="cart-items-header">
              <span>Item Details</span>
              <button
                type="button"
                className="cart-clear-btn"
                onClick={clearCart}
                title="Remove all items from your cart"
              >
                Clear Cart
              </button>
            </div>

            <div className="cart-items-list">
              {cartItems.map((item) => {
                const itemKey =
                  item.cartItemId || `${item.id}_${item.selectedSize || "default"}`;
                const itemPrice = Number(item.price) || 0;
                const itemQuantity = Number(item.quantity) || 1;
                const itemTotal = itemPrice * itemQuantity;
                const maxStock = Number(item.stock) || 10;
                const isMaxReached = itemQuantity >= maxStock;

                return (
                  <div className="cart-item-card" key={itemKey}>
                    {/* SHOE THUMBNAIL */}
                    <Link
                      to={`/product/${item.id}`}
                      className="cart-item-img-wrap"
                      title={item.name}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="cart-item-img"
                          loading="lazy"
                        />
                      ) : (
                        <div className="cart-item-no-img">👟</div>
                      )}
                    </Link>

                    {/* SHOE INFO */}
                    <div className="cart-item-info">
                      <div className="cart-item-header-row">
                        <Link
                          to={`/product/${item.id}`}
                          className="cart-item-title"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          className="cart-item-remove-btn"
                          onClick={() => removeFromCart(item.cartItemId || item.id)}
                          aria-label={`Remove ${item.name} from cart`}
                          title="Remove item"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>

                      {item.selectedSize && (
                        <div className="cart-item-meta">
                          <span className="cart-size-pill">
                            Size: UK {item.selectedSize}
                          </span>
                          {item.stock !== undefined && item.stock <= 5 && (
                            <span className="cart-stock-warning">
                              Only {item.stock} left in stock
                            </span>
                          )}
                        </div>
                      )}

                      {/* CONTROLS & PRICE ROW */}
                      <div className="cart-item-bottom-row">
                        <div className="cart-qty-wrapper">
                          <span className="cart-qty-label">Quantity:</span>
                          <div className="cart-qty-stepper">
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() =>
                                decreaseQuantity(item.cartItemId || item.id)
                              }
                              aria-label="Decrease quantity"
                              disabled={itemQuantity <= 1}
                            >
                              <FaMinus />
                            </button>
                            <span className="qty-number">{itemQuantity}</span>
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() =>
                                increaseQuantity(item.cartItemId || item.id)
                              }
                              aria-label="Increase quantity"
                              disabled={isMaxReached}
                            >
                              <FaPlus />
                            </button>
                          </div>
                        </div>

                        <div className="cart-item-price-block">
                          <span className="cart-item-subtotal">
                            ₹{itemTotal.toLocaleString("en-IN")}
                          </span>
                          {itemQuantity > 1 && (
                            <span className="cart-item-unit-price">
                              (₹{itemPrice.toLocaleString("en-IN")} each)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="cart-summary-section">
            <div className="cart-summary-card">
              <h2 className="summary-card-title">Order Summary</h2>

              <div className="summary-line-rows">
                <div className="summary-line">
                  <span className="line-label">Bag Subtotal</span>
                  <span className="line-value">₹{cartTotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="summary-line">
                  <span className="line-label">Estimated Shipping</span>
                  <span className="line-value free-tag">FREE</span>
                </div>

                <div className="summary-line">
                  <span className="line-label">Tax & GST</span>
                  <span className="line-value included-tag">Included</span>
                </div>
              </div>

              <div className="summary-divider" />

              <div className="summary-total-row">
                <div>
                  <span className="total-label">Total Amount</span>
                  <p className="total-subtext">Includes all applicable duties</p>
                </div>
                <span className="total-amount-val">
                  ₹{cartTotal.toLocaleString("en-IN")}
                </span>
              </div>

              <button
                type="button"
                className="btn-checkout-primary"
                onClick={handleCheckout}
              >
                <span>Proceed to Checkout</span>
                <FaArrowRight className="checkout-btn-arrow" />
              </button>

              <div className="cart-security-badges">
                <div className="security-badge-item">
                  <FaLock className="sec-icon" />
                  <span>256-Bit SSL Encrypted Checkout</span>
                </div>
                <div className="security-badge-item">
                  <FaTruck className="sec-icon" />
                  <span>Fast Insured Doorstep Delivery</span>
                </div>
                <div className="security-badge-item">
                  <FaShieldAlt className="sec-icon" />
                  <span>100% Guaranteed Authentic Sneakers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
