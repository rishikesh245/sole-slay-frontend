import "./Checkout.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useCart, useToast } from "../../Context/Context";
import { createOrder } from "../../api/orderApi";
import { sendOrderConfirmationEmail } from "../../services/emailService";

function Checkout() {
  const { user, openLogin } = useAuth();
  const { cartItems, clearCart, cartTotal } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState(user?.email || "");
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!user) {
    return (
      <div className="checkout">
        <div className="checkout-auth-required">
          <h2>Authentication Required</h2>
          <p>Please log in to complete your checkout and delivery details.</p>
          <button type="button" className="place-order-btn" onClick={openLogin}>
            Log In / Sign Up
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout">
        <div className="checkout-empty-state">
          <h2>Your Cart is Empty</h2>
          <p>You do not have any items in your cart to checkout.</p>
          <button
            type="button"
            className="place-order-btn"
            onClick={() => navigate("/shop")}
          >
            Explore Footwear
          </button>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (isSubmitting) return;

    if (!email.trim() || !mobile.trim() || !address.trim()) {
      const msg = "Please provide your email, phone number, and delivery address.";
      setErrorMessage(msg);
      showToast(msg, "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Dual-compatible order payload:
      // - Provides total_amount, item.name, and item.price for legacy Render backend compatibility.
      // - Provides id, quantity, and size for modern backend transactional validation.
      const orderData = {
        name: user.name || "Customer",
        email: email.trim(),
        mobile: mobile.trim(),
        address: address.trim(),
        total_amount: Number(cartTotal) || 0,
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name || "Footwear Item",
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
          size: item.selectedSize || "7",
        })),
      };

      const response = await createOrder(orderData);
      const placedOrder = response.data?.order || {
        ...orderData,
        id: Math.floor(1000 + Math.random() * 9000),
      };

      // Dispatch order confirmation email via EmailJS (awaited with safety fallback)
      try {
        await Promise.race([
          sendOrderConfirmationEmail({
            order: placedOrder,
            items: cartItems,
            user,
          }),
          new Promise((resolve) => setTimeout(resolve, 3500)),
        ]);
      } catch (emailErr) {
        console.warn("Email confirmation notice:", emailErr);
      }

      // Clear the local cart on verified atomic transaction commit
      clearCart();

      // Navigate to order success with real backend order data
      navigate("/order-success", {
        state: { order: placedOrder },
      });
    } catch (error) {
      console.error("ORDER ERROR:", error);
      const serverMsg =
        error.response?.data?.message ||
        "Failed to place order. Please review your cart and try again.";
      setErrorMessage(serverMsg);
      showToast(serverMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout">
      <h2>Checkout</h2>

      {errorMessage && (
        <div className="checkout-error-banner" role="alert">
          ⚠️ {errorMessage}
        </div>
      )}

      <div className="checkout-content">
        {/* CUSTOMER & DELIVERY DETAILS */}
        <div className="checkout-details">
          <h3>Customer Details</h3>

          <input
            type="text"
            value={user.name || ""}
            placeholder="Full Name"
            readOnly
          />

          <input
            type="email"
            value={email}
            placeholder="Email Address"
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            required
          />

          <input
            type="tel"
            value={mobile}
            placeholder="Phone Number (10 digits)"
            onChange={(e) => setMobile(e.target.value)}
            disabled={isSubmitting}
            required
          />

          <h3>Delivery Address</h3>

          <textarea
            value={address}
            placeholder="House / Flat No., Street, Landmark, City, State, Pincode"
            onChange={(e) => setAddress(e.target.value)}
            disabled={isSubmitting}
            rows={4}
            required
          ></textarea>
        </div>

        {/* ORDER SUMMARY */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>

          <div className="checkout-items-list">
            {cartItems.map((item) => {
              const itemKey =
                item.cartItemId || `${item.id}_${item.selectedSize || "default"}`;
              return (
                <div className="checkout-item" key={itemKey}>
                  <div className="checkout-item-info">
                    <span className="checkout-item-title">{item.name}</span>
                    <span className="checkout-item-sub">
                      Size: UK {item.selectedSize || "7"} × {item.quantity}
                    </span>
                  </div>

                  <span className="checkout-item-price">
                    ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              );
            })}
          </div>

          <hr />

          <div className="checkout-total">
            <strong>Estimated Total</strong>
            <strong>₹{cartTotal.toLocaleString("en-IN")}</strong>
          </div>

          <button
            type="button"
            className="place-order-btn"
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Securing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
