import "./Cart.css";
import { CartContext } from "../../Context/Context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

function Cart({user, setShowLogin}) {

  const { cartItems, setCartItems} = useContext(CartContext);
  const navigate = useNavigate();


  const removeFromCart = (id) => {

  const updatedCart = cartItems.filter(
    (item) => item.id !== id
  );

  setCartItems(updatedCart);
};

// add function
const increaseQuantity = (id) => {

  const updatedCart = cartItems.map((item) => {

    if (item.id === id) {
      return {
        ...item,
        quantity: item.quantity + 1
      };
    }

    return item;
  });

  setCartItems(updatedCart);
};

// reduce elements

const decreaseQuantity = (id) => {

  const updatedCart = cartItems.map((item) => {

    if (item.id === id) {
      return {
        ...item,
        quantity: item.quantity - 1
      };
    }

    return item;
  })
 .filter((item) => item.quantity > 0);

  setCartItems(updatedCart);
};

//total
const totalPrice = cartItems.reduce((total, item) => {
  return total + item.price * item.quantity;
}, 0);

const totalItems = cartItems.reduce((total, item) => {
  return total + item.quantity;
}, 0);

const handleCheckout = () => {

    if (!user) {
        setShowLogin(true);
        return;
    }

    navigate("/checkout");
};


  return (
    <div className="cart">

      <h2>Your Cart</h2>

      <h3>Total Items: {cartItems.length}</h3>

      {cartItems.map((item) => (
        <div className="cart-item" key={item.id}>

         <img
    src={item.image}
    alt={item.name}
/>

          <h3>{item.name}</h3>

          <p>₹{item.price}</p>
        <div className="quantity-control">
          <button onClick={() => decreaseQuantity(item.id)}>-</button>

            <p>{item.quantity}</p>
          
          <button onClick={() => increaseQuantity(item.id)}>+</button>
        </div>

          <button className = "remove-btn" onClick={() => removeFromCart(item.id)}>
            Remove
          </button>

        </div>
      ))}

      <div className="order-summary">

  <h2>Order Summary</h2>

  <div className="summary-row">
    <span>Items</span>
    <span>{totalItems}</span>
  </div>

  <div className="summary-row">
    <span>Subtotal</span>
    <span>₹{totalPrice}</span>
  </div>

  <div className="summary-row">
    <span>Delivery</span>
    <span>FREE</span>
  </div>

  <hr />

  <div className="summary-total">
    <span>Total</span>
    <span>₹{totalPrice}</span>
  </div>

  <button className="checkout-btn" onClick={handleCheckout}>
    Proceed to Checkout
  </button>

</div>

    </div>
  );
}

export default Cart;
