import "./Footer.css";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../Context/Context";
import {
  FaShoePrints,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

function Footer() {
  const navigate = useNavigate();
  const { setCategory, setSubcategory, clearFilters } = useProducts();

  const handleShopFilter = (cat, subcat = "") => {
    setCategory(cat);
    setSubcategory(subcat);
    navigate("/shop");
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* BRAND */}
        <div className="footer-brand">
          <div className="footer-logo">
            <FaShoePrints />
            <h2>SOLE SLAY</h2>
          </div>
          <p>
            Step into comfort. Walk in style.
            Find the perfect pair for every step.
          </p>
        </div>

        {/* SHOP */}
        <div className="footer-column">
          <h3>Shop</h3>
          <ul>
            <li onClick={() => handleShopFilter(1, "")}>Men's Collection</li>
            <li onClick={() => handleShopFilter(2, "")}>Women's Collection</li>
            <li onClick={() => handleShopFilter("All", 1)}>Sports & Running</li>
            <li
              onClick={() => {
                clearFilters();
                navigate("/shop");
              }}
            >
              New Arrivals
            </li>
          </ul>
        </div>

        {/* HELP */}
        <div className="footer-column">
          <h3>Help & Support</h3>
          <ul>
            <li onClick={() => navigate("/my-orders")}>Track Orders</li>
            <li onClick={() => navigate("/cart")}>Shopping Bag</li>
            <li>30-Day Return Guarantee</li>
            <li>Free Express Shipping</li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div className="footer-column">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram className="instagram-icon" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="footer-bottom">
        <p>© 2026 Sole Slay Footwear Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
