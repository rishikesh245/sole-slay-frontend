import "./Navbar.css";
import { CartContext } from "../../Context/Context";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaShoePrints,
  FaBars
} from "react-icons/fa";

function Navbar({
  setSidebarOpen,
  searchTerm,
  setSearchTerm,
  setShowLogin,
  user,
  setUser
}) {

  const { cartItems } = useContext(CartContext);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
    setUserMenuOpen(false);
  };

  return (
    <nav className="navbar">

      {/* LEFT */}
      <div className="navbar-left">

        <button
          className="menu-btn"
          onClick={() => setSidebarOpen(true)}
        >
          <FaBars />
        </button>

        <Link
          to={isAdmin ? "/admin/dashboard" : "/"}
          className="logo-link"
        >
          <div className="logo">
            <FaShoePrints className="logo-icon" />
            <h1>𝕊𝕆𝕃𝔼 𝕊𝕃𝔸𝕐</h1>
          </div>
        </Link>

      </div>


      {/* CENTER */}
      <div className="navbar-center">

        {isAdmin ? (

          <>
            <Link
              to="/admin/products"
              className="nav-item"
            >
              Products
            </Link>
        
            <Link
              to="/admin/dashboard"
              className="nav-item"
            >
              Dashboard
            </Link>
          </>

        ) : (

          <>
            <Link
              to="/"
              className="nav-item"
            >
              Home
            </Link>

            <Link
              to="/shop"
              className="nav-item"
            >
              Shop
            </Link>


             <Link
              to="/my-orders" 
              className="nav-item">
                My Orders
             </Link>

            <div className="search-box">

              <FaSearch className="search-icon" />

              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

            </div>
          </>

        )}

      </div>


      {/* RIGHT */}
      <div className="navbar-actions">

        {/* CART */}
        {!isAdmin && (
        <Link
          to="/cart"
          className="cart-link"
        >

          <div className="cart-icon">

            <FaShoppingCart />

            {cartItems.length > 0 && (
              <span className="cart-count">
                {cartItems.length}
              </span>
            )}
            

          </div>

        </Link>
        )}


        {/* USER */}

        {user ? (

          <div className="user-menu-container">

            <button
              className="logged-user"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >

              <FaUser />

              <span>
                Hi, {user.name}
              </span>

              <span className="dropdown-arrow">
                ▾
              </span>

            </button>


            {userMenuOpen && (

              <div className="user-dropdown">

                <div className="dropdown-user-name">
                  <FaUser />
                  <span>{user.name}</span>
                </div>

                <button
                  onClick={handleLogout}
                >
                  ↪ Logout
                </button>

              </div>

            )}

          </div>

        ) : (

          <button
            className="user-icon"
            onClick={() => setShowLogin(true)}
          >
            <FaUser />
          </button>

        )}

      </div>

    </nav>
  );
}

export default Navbar;