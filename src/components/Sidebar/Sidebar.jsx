import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

function Sidebar({
    sidebarOpen,
    setSidebarOpen,
    category,
    onCategoryChange,
    onSubcategoryChange,
    price,
    onPriceChange,
    onClearFilters,
    user,
    setUser
}) {
    const navigate = useNavigate();

      const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    
};

    const isAdmin = user?.role === "admin" ;
    return (
        <>

            {/* DARK OVERLAY */}

            <div
                className={`overlay ${sidebarOpen ? "show" : ""}`}
                onClick={() => setSidebarOpen(false)}
            ></div>


            {/* SIDEBAR */}

            <aside
                className={`sidebar ${sidebarOpen ? "open" : ""}`}
            >
                {isAdmin ? (
                    <div className="admin-sidebar">

    <h3>Admin Panel</h3>

    <button onClick={() => navigate("/admin/dashboard")}>📊 Dashboard</button>

    <button onClick={() => navigate("/admin/products")}>👟 Products</button>

    <button onClick={() => navigate("/admin/add-product")}>➕ Add Product</button>

    <button onClick={handleLogout}>🚪 Logout</button>

</div>
                ) : ( <div>                    



                {/* HEADER */}

                <div className="sidebar-header">

                    <div>

                        <h2>Shop & Filter</h2>

                        <p>
                            Find your perfect pair
                        </p>

                    </div>


                    <button
                        className="close-button"
                        onClick={() => setSidebarOpen(false)}
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
                            checked={category === 1}
                            onChange={() => onCategoryChange(1)}
                        />

                        <span>
                            Men
                        </span>

                    </label>


                    <label>

                        <input
                            type="radio"
                            name="category"
                            checked={category === 2}
                            onChange={() => onCategoryChange(2)}
                        />

                        <span>
                            Women
                        </span>

                    </label>

                </div>


                {/* SUBCATEGORY */}

                <div className="filter-section">

                    <h3>
                        Subcategory
                    </h3>


                    {/* RUNNING */}

                    <label>

                        <input
                            type="radio"
                            name="subcategory"
                            onChange={() => {

                                if (category === 1) {

                                    onSubcategoryChange(1);

                                } else if (category === 2) {

                                    onSubcategoryChange(8);

                                }

                            }}
                        />

                        <span>
                            Running
                        </span>

                    </label>


                    {/* MEN SUBCATEGORIES */}

                    {category === 1 && (
                        <>

                            <label>

                                <input
                                    type="radio"
                                    name="subcategory"
                                    onChange={() =>
                                        onSubcategoryChange(2)
                                    }
                                />

                                <span>
                                    Sneakers
                                </span>

                            </label>


                            <label>

                                <input
                                    type="radio"
                                    name="subcategory"
                                    onChange={() =>
                                        onSubcategoryChange(3)
                                    }
                                />

                                <span>
                                    Formal
                                </span>

                            </label>

                        </>
                    )}


                    {/* WOMEN SUBCATEGORIES */}

                    {category === 2 && (
                        <>

                            <label>

                                <input
                                    type="radio"
                                    name="subcategory"
                                    onChange={() =>
                                        onSubcategoryChange(5)
                                    }
                                />

                                <span>
                                    Heels
                                </span>

                            </label>


                            <label>

                                <input
                                    type="radio"
                                    name="subcategory"
                                    onChange={() =>
                                        onSubcategoryChange(6)
                                    }
                                />

                                <span>
                                    Flats
                                </span>

                            </label>

                        </>
                    )}

                </div>


                {/* PRICE */}

                <div className="filter-section">

                    <h3>
                        Price
                    </h3>


                    <label>

                        <input
                            type="radio"
                            name="price"
                             checked={price === "under 2000"}
                            onChange={() => onPriceChange("under 2000")}
                        />

                        <span>
                            Under ₹2000
                        </span>

                    </label>


                    <label>

                        <input
                            type="radio"
                            name="price"
                             checked={price === "2000-3000"}
                            onChange={() => onPriceChange("2000-3000")}
                        />

                        <span>
                            ₹2000 - ₹3000
                        </span>

                    </label>


                    <label>

                        <input
                            type="radio"
                            name="price"
                             checked={price === "above 3000"}
                            onChange={() => onPriceChange("above 3000")}
                        />

                        <span>
                            Above ₹3000
                        </span>

                    </label>

                </div>


                {/* CLEAR FILTERS */}

                <button
                 className="clear-button"
                 onClick={onClearFilters}>
                    Clear Filters
                </button>

            </div>

                )}
                

            </aside>

        </>
    );
}


export default Sidebar;