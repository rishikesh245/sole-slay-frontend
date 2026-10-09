import "./Checkout.css";
import { useContext, useState } from "react";
import { CartContext } from "../../Context/Context";
import { createOrder } from "../../api/orderApi";
import { useNavigate } from "react-router-dom";

function Checkout() {

    const { cartItems,setCartItems } = useContext(CartContext);

    const savedUser = localStorage.getItem("user");
    const user = savedUser ? JSON.parse(savedUser) : null;

    const totalPrice = cartItems.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);

    const [email, setEmail] = useState(user?.email || "");
    const [mobile, setMobile] = useState(user?.mobile || "");
    const [address, setAddress] = useState("");

    const navigate = useNavigate();

    const handlePlaceOrder = async () => {
        try {

            const orderData = {
                name: user.name,
                email: email,
                mobile: mobile,
                address: address,
                total_amount: totalPrice,
                items: cartItems
            };

            await createOrder(orderData);

            setCartItems([]); // Clear the cart after successful order placement

            navigate("/order-success");

        } catch (error) {
            console.error("ORDER ERROR:", error);
        }
    };

    return (
        <div className="checkout">

            <h2>Checkout</h2>

            <div className="checkout-content">

                <div className="checkout-details">

                    <h3>Customer Details</h3>

                    <input
                        type="text"
                        value={user?.name || ""}
                        placeholder="Full Name"
                        readOnly
                    />

                    <input
                        type="email"
                        value={email}
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="text"
                        value={mobile}
                        placeholder="Phone Number"
                        onChange={(e) => setMobile(e.target.value)}
                    />

                    <h3>Delivery Address</h3>

                    <textarea
                        value={address}
                        placeholder="Enter your delivery address"
                        onChange={(e) => setAddress(e.target.value)}
                    ></textarea>

                </div>

                <div className="checkout-summary">

                    <h3>Order Summary</h3>

                    {cartItems.map((item) => (
                        <div
                            className="checkout-item"
                            key={item.id}
                        >
                            <span>
                                {item.name} × {item.quantity}
                            </span>

                            <span>
                                ₹{item.price * item.quantity}
                            </span>
                        </div>
                    ))}

                    <hr />

                    <div className="checkout-total">
                        <strong>Total</strong>
                        <strong>₹{totalPrice}</strong>
                    </div>

                    <button
                        className="place-order-btn"
                        onClick={handlePlaceOrder}
                    >
                        Place Order
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Checkout;