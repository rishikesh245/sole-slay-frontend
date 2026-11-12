import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import { useAuth, useProducts, useUI } from "../../Context/Context.jsx";

function Sidebar({
  sidebarOpen: propSidebarOpen,
  setSidebarOpen: propSetSidebarOpen,
  category: propCategory,
  onCategoryChange: propOnCategoryChange,
  onSubcategoryChange: propOnSubcategoryChange,
  price: propPrice,
  onPriceChange: propOnPriceChange,
  onClearFilters: propOnClearFilters,
}) {
  const navigate = useNavigate();
  const { logout, isAdmin } = useAuth();
  const { sidebarOpen: storeSidebarOpen, setSidebarOpen: setStoreSidebarOpen } =
    useUI();
  const {
    category: storeCategory,
    setCategory: setStoreCategory,
    setSubcategory: setStoreSubcategory,
    price: storePrice,
    setPrice: setStorePrice,
    clearFilters: storeClearFilters,
  } = useProducts();

  const isSidebarOpen =
    propSidebarOpen !== undefined ? propSidebarOpen : storeSidebarOpen;
  const closeSidebar = () => {
    if (propSetSidebarOpen) propSetSidebarOpen(false);
    setStoreSidebarOpen(false);
  };

  const category = propCategory !== undefined ? propCategory : storeCategory;
  const price = propPrice !== undefined ? propPrice : storePrice;

  const handleCategoryChange = (val) => {
    if (propOnCategoryChange) propOnCategoryChange(val);
    setStoreCategory(val);
  };

  const handleSubcategoryChange = (val) => {
    if (propOnSubcategoryChange) propOnSubcategoryChange(val);
    setStoreSubcategory(val);
  };

  const handlePriceChange = (val) => {
    if (propOnPriceChange) propOnPriceChange(val);
    setStorePrice(val);
  };

  const handleClearFilters = () => {
    if (propOnClearFilters) propOnClearFilters();
    storeClearFilters();
  };

  const handleLogout = () => {
    logout();
    closeSidebar();
    navigate("/");
  };

  return (
    <>
      {/* DARK OVERLAY */}
      <div
        className={`overlay ${isSidebarOpen ? "show" : ""}`}
        onClick={closeSidebar}
      ></div>

      {/* SIDEBAR DRAWER */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        {isAdmin ? (
          <div className="admin-sidebar">
            <h3>Admin Panel</h3>
            <button
              onClick={() => {
                navigate("/admin/dashboard");
                closeSidebar();
              }}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => {
                navigate("/admin/products");
                closeSidebar();
              }}
            >
              👟 Products
            </button>
            <button
              onClick={() => {
                navigate("/admin/add-product");
                closeSidebar();
              }}
            >
              ➕ Add Product
            </button>
            <button onClick={handleLogout}>🚪 Logout</button>
          </div>
        ) : (
          <div>
            {/* HEADER */}
            <div className="sidebar-header">
              <div>
                <h2>Shop & Filter</h2>
                <p>Find your perfect pair in real time</p>
              </div>

              <button
                type="button"
                className="close-button"
                onClick={closeSidebar}
                aria-label="Close filters"
              >
                ×
              </button>
            </div>

            {/* CATEGORY */}
            <div className="filter-section">
              <h3>Category</h3>

              <label>
                <input
                  type="radio"
                  name="category"
                  checked={String(category) === "All"}
                  onChange={() => handleCategoryChange("All")}
                />
                <span>All Footwear</span>
              </label>

              <label>
                <input
                  type="radio"
                  name="category"
                  checked={String(category) === "1"}
                  onChange={() => handleCategoryChange(1)}
                />
                <span>Men</span>
              </label>

              <label>
                <input
                  type="radio"
                  name="category"
                  checked={String(category) === "2"}
                  onChange={() => handleCategoryChange(2)}
                />
                <span>Women</span>
              </label>
            </div>

            {/* SUBCATEGORY */}
            <div className="filter-section">
              <h3>Subcategory</h3>

              <label>
                <input
                  type="radio"
                  name="subcategory"
                  onChange={() => {
                    if (String(category) === "1") {
                      handleSubcategoryChange(1);
                    } else if (String(category) === "2") {
                      handleSubcategoryChange(8);
                    } else {
                      handleSubcategoryChange(1);
                    }
                  }}
                />
                <span>Running</span>
              </label>

              {String(category) === "1" && (
                <>
                  <label>
                    <input
                      type="radio"
                      name="subcategory"
                      onChange={() => handleSubcategoryChange(2)}
                    />
                    <span>Sneakers</span>
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="subcategory"
                      onChange={() => handleSubcategoryChange(3)}
                    />
                    <span>Formal</span>
                  </label>
                </>
              )}

              {String(category) === "2" && (
                <>
                  <label>
                    <input
                      type="radio"
                      name="subcategory"
                      onChange={() => handleSubcategoryChange(5)}
                    />
                    <span>Heels</span>
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="subcategory"
                      onChange={() => handleSubcategoryChange(6)}
                    />
                    <span>Flats</span>
                  </label>
                </>
              )}
            </div>

            {/* PRICE */}
            <div className="filter-section">
              <h3>Price</h3>

              <label>
                <input
                  type="radio"
                  name="price"
                  checked={price === "All"}
                  onChange={() => handlePriceChange("All")}
                />
                <span>All Prices</span>
              </label>

              <label>
                <input
                  type="radio"
                  name="price"
                  checked={price === "under 2000"}
                  onChange={() => handlePriceChange("under 2000")}
                />
                <span>Under ₹2000</span>
              </label>

              <label>
                <input
                  type="radio"
                  name="price"
                  checked={price === "2000-3000"}
                  onChange={() => handlePriceChange("2000-3000")}
                />
                <span>₹2000 - ₹3000</span>
              </label>

              <label>
                <input
                  type="radio"
                  name="price"
                  checked={price === "above 3000"}
                  onChange={() => handlePriceChange("above 3000")}
                />
                <span>Above ₹3000</span>
              </label>
            </div>

            {/* CLEAR FILTERS */}
            <button
              type="button"
              className="clear-button"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default Sidebar;
