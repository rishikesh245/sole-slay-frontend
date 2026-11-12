import ProductCard from "./ProductCard";
import "./Products.css";
import { useProducts } from "../../Context/Context.jsx";

function Products({
    searchTerm: propSearchTerm,
    category: propCategory,
    subcategory: propSubcategory,
    price: propPrice,
}) {
    const {
        filteredProducts,
        searchTerm: storeSearchTerm,
        category: storeCategory,
        subcategory: storeSubcategory,
        price: storePrice,
        loadingProducts,
    } = useProducts();

    const searchTerm =
        propSearchTerm !== undefined ? propSearchTerm : storeSearchTerm;
    const category =
        propCategory !== undefined ? propCategory : storeCategory;
    const subcategory =
        propSubcategory !== undefined ? propSubcategory : storeSubcategory;
    const price =
        propPrice !== undefined ? propPrice : storePrice;

    const categoryName = {
        1: "Men",
        2: "Women",
    };

    const subcategoryName = {
        1: "Running",
        2: "Sneakers",
        3: "Formal",
        5: "Heels",
        6: "Flats",
    };

    const priceName = {
        "under 2000": "Under ₹2000",
        "2000-3000": "₹2000 - ₹3000",
        "above 3000": "Above ₹3000",
    };

    const hasFilter =
        category !== "All" ||
        Boolean(subcategory) ||
        price !== "All";

    return (
        <section className="products">
            <div className="products-inner-wrapper">
                <div className="products-header">
                    <div>
                        <h2>
                            {searchTerm && searchTerm.trim()
                                ? `Search Results (${filteredProducts.length})`
                                : "Featured Footwear"}
                        </h2>
                        {searchTerm && searchTerm.trim() && (
                            <p className="search-text">
                                Results for "{searchTerm}"
                            </p>
                        )}
                    </div>

                    <span className="product-count">
                        {filteredProducts.length}
                        {filteredProducts.length === 1
                            ? " product"
                            : " products"}
                    </span>
                </div>

                {hasFilter && (
                    <div className="active-filters">
                        <span className="filter-label">Filters:</span>

                        {category !== "All" && (
                            <span className="filter-chip">
                                {categoryName[category] || category}
                            </span>
                        )}

                        {subcategory && (
                            <span className="filter-chip">
                                {subcategoryName[subcategory] || subcategory}
                            </span>
                        )}

                        {price !== "All" && (
                            <span className="filter-chip">
                                {priceName[price] || price}
                            </span>
                        )}
                    </div>
                )}

                {loadingProducts && filteredProducts.length === 0 ? (
                    <div className="products-loading-state">
                        <div className="products-spinner"></div>
                        <p>Loading real-time catalog...</p>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="product-list">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                price={product.price}
                                images={product.images}
                                stock={product.stock}
                                subcategory={product.Subcategory?.name}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="no-products">
                        <h3>No footwear found</h3>
                        <p>Try searching with another keyword or adjusting your filters.</p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default Products;
