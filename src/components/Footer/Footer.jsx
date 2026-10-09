import "./Footer.css";

import {
  FaShoePrints,
  FaFacebookF,
  FaInstagram,
  FaTwitter
} from "react-icons/fa";

function Footer() {
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
            <li>Men</li>
            <li>Women</li>
            <li>Sports</li>
            <li>New Arrivals</li>
          </ul>
        </div>


        {/* HELP */}
        <div className="footer-column">
          <h3>Help</h3>

          <ul>
            <li>Customer Service</li>
            <li>Returns & Exchanges</li>
            <li>Shipping Information</li>
            <li>FAQ</li>
          </ul>
        </div>


        {/* SOCIAL */}
        <div className="footer-column">
          <h3>Follow Us</h3>

          <div className="social-icons">
            <FaFacebookF />
            <FaInstagram className="instagram-icon" />
            <FaTwitter />
          </div>
        </div>

      </div>


      {/* COPYRIGHT */}
      <div className="footer-bottom">
        <p>© 2026 Sole Slay. All rights reserved.</p>
      </div>

    </footer>
  );
}

export default Footer;