import "./Dashboard.css";
import { useEffect, useState } from "react";
import { getProducts } from "../../api/productApi";

function Dashboard() {

    const [productCount, setProductCount] = useState(0);

    useEffect(() => {

        getProducts()
            .then((response) => {

                console.log("DASHBOARD PRODUCTS:", response.data);

                setProductCount(response.data.length);

            })
            .catch((error) => {

                console.error(
                    "DASHBOARD PRODUCT ERROR:",
                    error
                );

            });

    }, []);


    return (
        <div className="admin-dashboard">

            <div className="dashboard-header">

                <div>
                    <h1>Admin Dashboard</h1>

                    <p>
                        Welcome to Sole Slay Admin Panel
                    </p>
                </div>

            </div>


            <div className="dashboard-cards">

                <div className="dashboard-card products-card">

                    <div className="card-icon">
                        📦
                    </div>

                    <div>

                        <h3>Products</h3>

                        <p className="card-number">
                            {productCount}
                        </p>

                        <span>
                            Manage products
                        </span>

                    </div>

                </div>


                <div className="dashboard-card orders-card">

                    <div className="card-icon">
                        🛒
                    </div>

                    <div>

                        <h3>Orders</h3>

                        <p className="card-number">
                            0
                        </p>

                        <span>
                            View customer orders
                        </span>

                    </div>

                </div>


                <div className="dashboard-card users-card">

                    <div className="card-icon">
                        👥
                    </div>

                    <div>

                        <h3>Customers</h3>

                        <p className="card-number">
                            0
                        </p>

                        <span>
                            Registered customers
                        </span>

                    </div>

                </div>


                <div className="dashboard-card sales-card">

                    <div className="card-icon">
                        ₹
                    </div>

                    <div>

                        <h3>Total Sales</h3>

                        <p className="card-number">
                            ₹0
                        </p>

                        <span>
                            Total revenue
                        </span>

                    </div>

                </div>

            </div>


            <div className="dashboard-section">

                <h2>Quick Actions</h2>

                <div className="quick-actions">

                    <button>
                        + Add Product
                    </button>

                    <button>
                        📦 Manage Products
                    </button>

                    <button>
                        🛒 View Orders
                    </button>

                </div>

            </div>


            <div className="dashboard-section">

                <h2>Recent Activity</h2>

                <div className="activity-box">

                    <p>
                        No recent activity.
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;