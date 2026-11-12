import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../Context/Context.jsx";
import { FaShoppingCart } from "react-icons/fa";
import "./ProductCard.css";

function ProductCard({
  id,
  name,
  price,
  images = [],
  stock,
  subcategory,
}) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);

  // Extract direct Cloudinary URLs from database
  const productImages = (Array.isArray(images) ? images : [])
    .map((item) => (typeof item === "string" ? item : item?.image_url))
    .filter(Boolean);

  const primaryImage = productImages[currentImage] || productImages[0] || "";

  const previousImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) =>
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  const numPrice = Number(price) || 0;
  const isOutOfStock = stock !== undefined && Number(stock) <= 0;
  const categoryLabel = subcategory || "Footwear";

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart({ id, name, price, images, stock });
  };

  return (
    <article
      className="product-card product-showcase-card"
      onClick={() => navigate(`/product/${id}`)}
    >
      {/* CLOUDINARY SHOE IMAGE STAGE */}
      <div className="card-image-stage">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={name}
            className={`card-shoe-img ${isOutOfStock ? "out-of-stock-image" : ""}`}
            loading="lazy"
          />
        ) : (
          <div className="card-no-image">No Image</div>
        )}

        {/* SLIDER CONTROLS FOR MULTI-IMAGE CLOUDINARY PRODUCTS */}
        {productImages.length > 1 && (
          <>
            <button
              type="button"
              className="card-slider-btn card-prev"
              onClick={previousImage}
              aria-label="Previous Image"
              title="Previous Image"
            >
              ❮
            </button>
            <button
              type="button"
              className="card-slider-btn card-next"
              onClick={nextImage}
              aria-label="Next Image"
              title="Next Image"
            >
              ❯
            </button>
          </>
        )}

        {isOutOfStock && (
          <span className="out-of-stock-badge">OUT OF STOCK</span>
        )}
      </div>

      {/* PRODUCT INFO */}
      <div className="card-info-content">
        <p className="card-product-category">{categoryLabel}</p>

        <h3 className="card-product-name" title={name}>
          {name}
        </h3>

        {/* PRICING & ACTION ROW */}
        <div className="card-price-action-row">
          <div className="price-block">
            <span className="current-selling-price">
              ₹
              {numPrice.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          {!isOutOfStock ? (
            <button
              type="button"
              className="card-cart-btn"
              onClick={handleAddToCart}
              aria-label={`Add ${name} to cart`}
              title="Add to cart"
            >
              <FaShoppingCart className="cart-btn-icon" />
              <span>Add</span>
            </button>
          ) : (
            <button
              type="button"
              className="card-cart-btn disabled"
              disabled
              title="Out of stock"
            >
              Sold Out
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
