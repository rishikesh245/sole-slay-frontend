import "./Dashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminStats, getAllOrdersAdmin } from "../../api/orderApi";

function Dashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        productCount: 0,
        orderCount: 0,
        customerCount: 0,
        totalSales: 0,
        recentOrders: []
    });

    const [showOrdersModal, setShowOrdersModal] = useState(false);
    const [allOrders, setAllOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);

    useEffect(() => {
        getAdminStats()
            .then((res) => {
                setStats(res.data);
            })
            .catch((err) => {
                console.error("DASHBOARD STATS ERROR:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleOpenOrders = () => {
        setShowOrdersModal(true);
        setOrdersLoading(true);
        getAllOrdersAdmin()
            .then((res) => {
                setAllOrders(res.data || []);
            })
            .catch((err) => {
                console.error("GET ALL ORDERS ERROR:", err);
            })
            .finally(() => {
                setOrdersLoading(false);
            });
    };

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>Welcome to Sole Slay Admin Control Center</p>
                </div>
            </div>

            {/* DASHBOARD STATS CARDS */}
            <div className="dashboard-cards">
                <div
                    className="dashboard-card products-card clickable-card"
                    onClick={() => navigate("/admin/products")}
                    title="Click to manage products"
                >
                    <div className="card-icon">📦</div>
                    <div>
                        <h3>Products</h3>
                        <p className="card-number">
                            {loading ? "..." : stats.productCount}
                        </p>
                        <span>Manage inventory</span>
                    </div>
                </div>

                <div
                    className="dashboard-card orders-card clickable-card"
                    onClick={handleOpenOrders}
                    title="Click to view customer orders"
                >
                    <div className="card-icon">🛒</div>
                    <div>
                        <h3>Orders</h3>
                        <p className="card-number">
                            {loading ? "..." : stats.orderCount}
                        </p>
                        <span>View customer orders</span>
                    </div>
                </div>

                <div className="dashboard-card users-card">
                    <div className="card-icon">👥</div>
                    <div>
                        <h3>Customers</h3>
                        <p className="card-number">
                            {loading ? "..." : stats.customerCount}
                        </p>
                        <span>Registered accounts</span>
                    </div>
                </div>

                <div className="dashboard-card sales-card">
                    <div className="card-icon">₹</div>
                    <div>
                        <h3>Total Sales</h3>
                        <p className="card-number">
                            {loading
                                ? "..."
                                : `₹${stats.totalSales.toLocaleString("en-IN", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2
                                  })}`}
                        </p>
                        <span>Verified revenue</span>
                    </div>
                </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="dashboard-section">
                <h2>Quick Actions</h2>
                <div className="quick-actions">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/add-product")}
                    >
                        + Add Product
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/admin/products")}
                    >
                        📦 Manage Products
                    </button>

                    <button
                        type="button"
                        onClick={handleOpenOrders}
                    >
                        🛒 View Customer Orders
                    </button>
                </div>
            </div>

            {/* RECENT ACTIVITY */}
            <div className="dashboard-section">
                <h2>Recent Order Activity</h2>
                <div className="activity-box">
                    {loading ? (
                        <p>Loading real-time activity...</p>
                    ) : stats.recentOrders && stats.recentOrders.length > 0 ? (
                        <div className="recent-orders-list">
                            {stats.recentOrders.map((ord) => (
                                <div className="recent-order-row" key={ord.id}>
                                    <div className="recent-order-main">
                                        <strong>Order #{ord.id}</strong> —{" "}
                                        <span className="order-customer-name">{ord.name}</span>
                                        <span className="order-items-summary">
                                            ({ord.OrderItems?.length || 0} item{ord.OrderItems?.length !== 1 ? "s" : ""})
                                        </span>
                                    </div>
                                    <div className="recent-order-meta">
                                        <span className="recent-order-amount">
                                            ₹{Number(ord.total_amount).toLocaleString("en-IN")}
                                        </span>
                                        <span className="recent-order-status">
                                            {ord.status || "Confirmed"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No recent orders found in database.</p>
                    )}
                </div>
            </div>

            {/* CUSTOMER ORDERS MODAL */}
            {showOrdersModal && (
                <div
                    className="admin-modal-overlay"
                    onClick={() => setShowOrdersModal(false)}
                >
                    <div
                        className="admin-orders-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2>All Customer Orders ({allOrders.length})</h2>
                            <button
                                type="button"
                                className="modal-close-btn"
                                onClick={() => setShowOrdersModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="modal-body">
                            {ordersLoading ? (
                                <div className="orders-loading">Loading customer orders...</div>
                            ) : allOrders.length === 0 ? (
                                <p className="no-orders-text">No customer orders placed yet.</p>
                            ) : (
                                <div className="admin-orders-table-wrapper">
                                    <table className="admin-orders-table">
                                        <thead>
                                            <tr>
                                                <th>Order #</th>
                                                <th>Customer</th>
                                                <th>Contact</th>
                                                <th>Items Ordered</th>
                                                <th>Total Amount</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allOrders.map((ord) => (
                                                <tr key={ord.id}>
                                                    <td>
                                                        <strong>#{ord.id}</strong>
                                                    </td>
                                                    <td>
                                                        <div>{ord.name}</div>
                                                        <small className="order-address-text">
                                                            {ord.address}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        <div>{ord.email}</div>
                                                        <small>{ord.mobile}</small>
                                                    </td>
                                                    <td>
                                                        {ord.OrderItems?.map((it) => (
                                                            <div key={it.id} className="admin-item-chip">
                                                                {it.product_name} (UK {it.size || "7"}) × {it.quantity}
                                                            </div>
                                                        ))}
                                                    </td>
                                                    <td>
                                                        <strong>
                                                            ₹{Number(ord.total_amount).toLocaleString("en-IN")}
                                                        </strong>
                                                    </td>
                                                    <td>
                                                        <span className="order-status-badge">
                                                            {ord.status || "Confirmed"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
