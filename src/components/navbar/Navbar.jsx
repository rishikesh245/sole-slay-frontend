import "./Navbar.css";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth, useCart, useProducts, useUI } from "../../Context/Context.jsx";
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaShoePrints,
  FaBars,
} from "react-icons/fa";

function Navbar({
  setSidebarOpen: propSetSidebarOpen,
  searchTerm: propSearchTerm,
  setSearchTerm: propSetSearchTerm,
  setShowLogin: propSetShowLogin,
  user: propUser,
}) {
  const { user: authUser, logout, openLogin, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { searchTerm: storeSearchTerm, setSearchTerm: setStoreSearchTerm } =
    useProducts();
  const { setSidebarOpen: setStoreSidebarOpen } = useUI();

  const user = propUser !== undefined ? propUser : authUser;
  const searchTerm =
    propSearchTerm !== undefined ? propSearchTerm : storeSearchTerm;
  const setSearchTerm = propSetSearchTerm || setStoreSearchTerm;
  const handleOpenLogin = propSetShowLogin
    ? () => propSetShowLogin(true)
    : openLogin;
  const handleOpenSidebar = propSetSidebarOpen
    ? () => propSetSidebarOpen(true)
    : () => setStoreSidebarOpen(true);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (val.trim() && location.pathname !== "/" && location.pathname !== "/shop") {
      navigate("/shop");
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* LEFT */}
      <div className="navbar-left">
        <button
          type="button"
          className="menu-btn"
          onClick={handleOpenSidebar}
          aria-label="Toggle navigation drawer"
        >
          <FaBars />
        </button>

        <Link to={isAdmin ? "/admin/dashboard" : "/"} className="logo-link">
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
            <Link to="/admin/products" className="nav-item">
              Products
            </Link>
            <Link to="/admin/dashboard" className="nav-item">
              Dashboard
            </Link>
          </>
        ) : (
          <>
            <Link to="/" className="nav-item">
              Home
            </Link>

            <Link to="/shop" className="nav-item">
              Shop
            </Link>

            <Link to="/my-orders" className="nav-item">
              My Orders
            </Link>

            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search products in real time..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchTerm("")}
                  title="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* RIGHT */}
      <div className="navbar-actions">
        {/* CART WITH REAL-TIME BADGE */}
        {!isAdmin && (
          <Link to="/cart" className="cart-link" aria-label="Shopping Cart">
            <div className="cart-icon">
              <FaShoppingCart />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </div>
          </Link>
        )}

        {/* USER PROFILE & DROPDOWN */}
        {user ? (
          <div className="user-menu-container">
            <button
              type="button"
              className="logged-user"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <FaUser />
              <span>Hi, {user.name}</span>
              <span className="dropdown-arrow">▾</span>
            </button>

            {userMenuOpen && (
              <div className="user-dropdown">
                <div className="dropdown-user-name">
                  <FaUser />
                  <span>{user.name}</span>
                </div>
                <button type="button" onClick={handleLogout}>
                  ↪ Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            className="user-icon"
            onClick={handleOpenLogin}
            aria-label="Login or Sign up"
          >
            <FaUser />
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
