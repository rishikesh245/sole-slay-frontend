import './Categories.css';
import {
  FaMale,
  FaFemale,
  FaRunning,
  FaShoePrints
} from "react-icons/fa";
function Categories() {
  return (
    <section className="categories">
      <h2>Shop By Categories</h2>
      <p>Explore our wide range of footwear categories to find the perfect pair for every occasion.</p>
     <div className="category-list">
        <div className="category-card">
          <FaMale className="category-icon" />
          <h3>Men's Shoes</h3>
          <button className="shop-now-button">Shop Now</button>
        </div>
        <div className="category-card">
          <FaFemale className="category-icon" />
          <h3>Women's Shoes</h3>
          <button className="shop-now-button">Shop Now</button>
        </div>
        <div className="category-card">
          <FaRunning className="category-icon" />
          <h3>Sports Shoes</h3>
          <button className="shop-now-button">Shop Now</button>
        </div>
        <div className="category-card">
          <FaShoePrints className="category-icon" />
          <h3>Casual Shoes</h3>
          <button className="shop-now-button">Shop Now</button>
        </div>
      </div>
    </section>
  );    
}

export default Categories;