import "./OrderSuccess.css";
import { useLocation, Link } from "react-router-dom";
import { FaCheckCircle, FaShoppingBag, FaArrowRight } from "react-icons/fa";

function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="order-success-page">
      <div className="order-success-card">
        <div className="success-icon-badge">
          <FaCheckCircle />
        </div>

        <h2>Order Placed Successfully!</h2>
        <p className="success-subtitle">
          Thank you for choosing Sole Slay. Your footwear order has been confirmed and atomic database verification succeeded.
        </p>

        {order ? (
          <div className="order-receipt-box">
            <div className="receipt-row">
              <span className="receipt-label">Order Reference:</span>
              <span className="receipt-value order-id-pill">#{order.id}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Verified Total:</span>
              <span className="receipt-value order-total-val">
                ₹{Number(order.total_amount).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Order Status:</span>
              <span className="receipt-value order-status-confirmed">
                ● {order.status || "Confirmed"}
              </span>
            </div>
            {order.email && (
              <div className="receipt-row receipt-email-row">
                <span className="receipt-label">Confirmation Sent To:</span>
                <span className="receipt-value order-email-val">{order.email}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="order-receipt-box">
            <p className="no-order-notice">
              Your recent purchase has been registered. You can review all orders in your profile.
            </p>
          </div>
        )}

        <div className="order-success-actions">
          <Link to="/my-orders" className="btn-view-orders">
            <FaShoppingBag /> View My Orders
          </Link>
          <Link to="/shop" className="btn-continue-shopping">
            Continue Shopping <FaArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
