import "./MyOrders.css";
import { useEffect, useState } from "react";
import { getMyOrders } from "../../api/orderApi";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../Context/Context";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    getMyOrders()
      .then((response) => {
        setOrders(response.data || []);
      })
      .catch((err) => {
        console.error("GET ORDERS ERROR:", err);
        setError("Unable to load orders. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, navigate]);

  return (
    <div className="my-orders">
      <h2>My Footwear Orders</h2>

      {loading ? (
        <div className="orders-loading-state">
          <div className="orders-spinner"></div>
          <p>Retrieving your order history...</p>
        </div>
      ) : error ? (
        <div className="orders-error-state">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      ) : orders.length === 0 ? (
        <div className="orders-empty-state">
          <h3>No Orders Yet</h3>
          <p>You haven't placed any footwear orders yet.</p>
          <Link to="/shop" className="orders-shop-btn">
            Explore Footwear Catalog
          </Link>
        </div>
      ) : (
        orders.map((order) => {
          const dateStr = order.createdAt
            ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "";

          return (
            <div className="order-card" key={order.id}>
              <div className="order-card-header">
                <div>
                  <h3>Order #{order.id}</h3>
                  {dateStr && <span className="order-date">{dateStr}</span>}
                </div>
                <span className="order-status-badge">
                  {order.status || "Confirmed"}
                </span>
              </div>

              <div className="order-items">
                {order.OrderItems?.map((item) => (
                  <div className="order-item" key={item.id}>
                    {item.Product?.images?.[0]?.image_url ? (
                      <img
                        src={item.Product.images[0].image_url}
                        alt={item.product_name}
                        className="order-product-image"
                      />
                    ) : (
                      <div className="order-product-placeholder">👟</div>
                    )}

                    <div className="order-product-info">
                      <p className="order-item-name">{item.product_name}</p>
                      <p className="order-item-meta">
                        Size: <strong>UK {item.size || "Standard"}</strong> • Qty:{" "}
                        <strong>{item.quantity}</strong>
                      </p>
                      <p className="order-item-price">
                        Price: ₹{Number(item.price).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-total">
                <span>Total Amount Paid:</span>
                <span className="order-total-amount">
                  ₹{Number(order.total_amount).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default MyOrders;
