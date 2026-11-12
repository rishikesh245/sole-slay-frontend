import "./Categories.css";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../Context/Context";
import {
  FaMale,
  FaFemale,
  FaRunning,
  FaShoePrints,
} from "react-icons/fa";

function Categories() {
  const navigate = useNavigate();
  const { setCategory, setSubcategory } = useProducts();

  const handleSelectCategory = (catId, subcatId = "") => {
    setCategory(catId);
    setSubcategory(subcatId);
    navigate("/shop");
  };

  return (
    <section className="categories">
      <h2>Shop By Categories</h2>
      <p>
        Explore our wide range of footwear categories to find the perfect pair for
        every occasion.
      </p>
      <div className="category-list">
        <div
          className="category-card"
          onClick={() => handleSelectCategory(1, "")}
          role="button"
          tabIndex={0}
        >
          <FaMale className="category-icon" />
          <h3>Men's Shoes</h3>
          <button
            type="button"
            className="shop-now-button"
            onClick={(e) => {
              e.stopPropagation();
              handleSelectCategory(1, "");
            }}
          >
            Shop Now
          </button>
        </div>

        <div
          className="category-card"
          onClick={() => handleSelectCategory(2, "")}
          role="button"
          tabIndex={0}
        >
          <FaFemale className="category-icon" />
          <h3>Women's Shoes</h3>
          <button
            type="button"
            className="shop-now-button"
            onClick={(e) => {
              e.stopPropagation();
              handleSelectCategory(2, "");
            }}
          >
            Shop Now
          </button>
        </div>

        <div
          className="category-card"
          onClick={() => handleSelectCategory("All", 1)}
          role="button"
          tabIndex={0}
        >
          <FaRunning className="category-icon" />
          <h3>Sports Shoes</h3>
          <button
            type="button"
            className="shop-now-button"
            onClick={(e) => {
              e.stopPropagation();
              handleSelectCategory("All", 1);
            }}
          >
            Shop Now
          </button>
        </div>

        <div
          className="category-card"
          onClick={() => handleSelectCategory("All", 2)}
          role="button"
          tabIndex={0}
        >
          <FaShoePrints className="category-icon" />
          <h3>Casual Shoes</h3>
          <button
            type="button"
            className="shop-now-button"
            onClick={(e) => {
              e.stopPropagation();
              handleSelectCategory("All", 2);
            }}
          >
            Shop Now
          </button>
        </div>
      </div>
    </section>
  );
}

export default Categories;
