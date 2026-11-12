import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../../Context/Context.jsx";
import {
  FaShoppingCart,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaArrowLeft,
} from "react-icons/fa";
import { getProductById } from "../../api/productApi";
import "./ProductDetails.css";

const STANDARD_SIZES = ["6", "7", "8", "9", "10", "11"];

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("7");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    let isCurrent = true;
    getProductById(id)
      .then((response) => {
        if (isCurrent) {
          setProduct(response.data);
        }
      })
      .catch((error) => {
        if (isCurrent) {
          console.error("ERROR fetching product:", error);
        }
      })
      .finally(() => {
        if (isCurrent) {
          setLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [id]);

  // Real product images from database (Cloudinary URLs)
  const displayImages =
    product?.images
      ?.map((item) => (typeof item === "string" ? item : item.image_url))
      .filter(Boolean) || [];

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity, selectedSize);
  };

  const handlePrevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImage((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  if (loading) {
    return (
      <div className="product-details-loading">
        <div className="details-spinner"></div>
        <p>Loading footwear details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-not-found">
        <h2>Footwear Not Found</h2>
        <p>The product you are looking for is not available or has been moved.</p>
        <Link to="/shop" className="back-to-shop-btn">
          <FaArrowLeft /> Back to Shop
        </Link>
      </div>
    );
  }

  const categoryName = product.Subcategory?.Category?.name || "Footwear";
  const subcategoryName = product.Subcategory?.name || "Casual";
  const isOutOfStock = Number(product.stock) <= 0;
  const isLowStock = Number(product.stock) > 0 && Number(product.stock) <= 3;

  return (
    <div className="product-details-page">
      {/* Breadcrumb Navigation */}
      <nav className="details-breadcrumb">
        <Link to="/">Home</Link>
        <span className="crumb-slash">/</span>
        <Link to="/shop">Shop</Link>
        <span className="crumb-slash">/</span>
        <span className="crumb-active">{product.name}</span>
      </nav>

      <div className="product-details-container">
        {/* ===================================================
            LEFT COLUMN: IMAGE GALLERY
            =================================================== */}
        <div className="details-image-section">
          <div className="details-stage-box">
            {displayImages.length > 1 && (
              <button
                type="button"
                className="stage-arrow arrow-left"
                onClick={handlePrevImage}
                aria-label="Previous Image"
              >
                <FaChevronLeft />
              </button>
            )}

            <div className="stage-image-wrapper">
              {displayImages.length > 0 ? (
                <img
                  src={displayImages[currentImage] || displayImages[0]}
                  alt={product.name}
                  className="details-main-img"
                />
              ) : (
                <div className="details-no-image">No Image Available</div>
              )}
            </div>

            {displayImages.length > 1 && (
              <button
                type="button"
                className="stage-arrow arrow-right"
                onClick={handleNextImage}
                aria-label="Next Image"
              >
                <FaChevronRight />
              </button>
            )}

            {isOutOfStock && (
              <div className="details-out-of-stock-pill">OUT OF STOCK</div>
            )}
          </div>

          {/* Thumbnails if multiple images exist */}
          {displayImages.length > 1 && (
            <div className="details-thumbnails-row">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`thumbnail-btn ${
                    currentImage === idx ? "active-thumb" : ""
                  }`}
                  onClick={() => setCurrentImage(idx)}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ===================================================
            RIGHT COLUMN: REAL PRODUCT DETAILS
            =================================================== */}
        <div className="details-info-section">
          {/* Category Tag */}
          <div className="details-category-tag">
            <span>{categoryName}</span> • <span>{subcategoryName}</span>
          </div>

          {/* Product Name */}
          <h1 className="details-title">{product.name}</h1>

          {/* Price */}
          <div className="details-price-row">
            <span className="details-price">
              ₹
              {Number(product.price).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className="tax-inclusive-text">Inclusive of all taxes</span>
          </div>

          {/* Stock Status Badge */}
          <div className="details-stock-row">
            {isOutOfStock ? (
              <span className="stock-badge stock-out">Out of Stock</span>
            ) : isLowStock ? (
              <span className="stock-badge stock-low">
                Only {product.stock} item{product.stock > 1 ? "s" : ""} left in stock!
              </span>
            ) : (
              <span className="stock-badge stock-available">
                <FaCheckCircle className="check-icon" /> In Stock ({product.stock} available)
              </span>
            )}
          </div>

          {/* Product Description */}
          {product.description && (
            <div className="details-description-box">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          )}

          {/* Size Selector */}
          <div className="details-size-selector">
            <div className="size-selector-header">
              <label>Select Size (UK)</label>
            </div>
            <div className="size-tiles-row">
              {STANDARD_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`size-tile ${
                    selectedSize === size ? "selected" : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="details-quantity-selector">
            <label>Quantity</label>
            <div className="qty-control-box">
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                disabled={quantity <= 1 || isOutOfStock}
              >
                –
              </button>
              <span className="qty-number">{quantity}</span>
              <button
                type="button"
                className="qty-btn"
                onClick={() =>
                  setQuantity((prev) =>
                    Math.min(product.stock || 10, prev + 1)
                  )
                }
                disabled={quantity >= (product.stock || 10) || isOutOfStock}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Action */}
          <div className="details-actions-row">
            {!isOutOfStock ? (
              <button
                type="button"
                className="btn-details-add-cart"
                onClick={handleAddToCart}
              >
                <FaShoppingCart className="cart-icon" /> Add to Cart
              </button>
            ) : (
              <button
                type="button"
                className="btn-details-add-cart disabled"
                disabled
              >
                Currently Unavailable
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
