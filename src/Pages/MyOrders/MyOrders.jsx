import "./MyOrders.css";
import { useEffect, useState } from "react";
import { getMyOrders } from "../../api/orderApi";
import { useNavigate } from "react-router-dom";

function MyOrders() {

    const [orders, setOrders] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

        const savedUser = localStorage.getItem("user");

        if (!savedUser) {
            setOrders([]);
            navigate("/");
            return;
        }

        getMyOrders()
            .then((response) => {

                console.log("MY ORDERS:", response.data);

                setOrders(response.data);

            })
            .catch((error) => {

                console.error(
                    "GET ORDERS ERROR:",
                    error
                );

                setOrders([]);

            });

    }, [navigate]);


    return (
        <div className="my-orders">

            <h2>My Orders</h2>

            {orders.length === 0 ? (

                <p>No orders found.</p>

            ) : (

                orders.map((order) => (

                    <div
                        className="order-card"
                        key={order.id}
                    >

                        <h3>Order #{order.id}</h3>

                        <div className="order-items">

                            {order.OrderItems.map((item) => (

                                <div
                                    className="order-item"
                                    key={item.id}
                                >

                                    <p>
                                        Product: {item.product_name}
                                    </p>

                                    <p>
                                        Quantity: {item.quantity}
                                    </p>

                                    <p>
                                        Price: ₹{item.price}
                                    </p>

                                </div>

                            ))}

                        </div>

                        <p>
                            Total: ₹{order.total_amount}
                        </p>

                        <p>
                            Status: {order.status}
                        </p>

                    </div>

                ))

            )}

        </div>
    );
}

export default MyOrders;