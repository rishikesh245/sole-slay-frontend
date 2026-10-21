import ProductCard from "./ProductCard";

import "./Products.css";

import { useEffect, useState } from "react";

import { getProducts } from "../../api/productApi";

function Products({
    searchTerm = "",
    category = "All",
    subcategory = "",
    price = "All",
    user,
    setShowLogin,
    setCartMessage,
    
    
}) {
   
    

    const [products, setProducts] = useState([]);

    useEffect(() => {

        getProducts(category, subcategory)
            .then((response) => {

                console.log("PRODUCTS:", response.data);

                setProducts(response.data);



            })
            .catch((error) => {

                console.error("ERROR:", error);

            });

    }, [category, subcategory]);


    const filteredProducts = products.filter((product) => {

        const matchesSearch =  product.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        
        let matchesPrice = true;

        if (price === "under 2000") {
            matchesPrice = Number(product.price) < 2000;
        }

           if (price === "2000-3000") {

            matchesPrice =
              Number(product.price) >= 2000 &&
              Number(product.price) <= 3000;

        }


            if (price === "above 3000") {

              matchesPrice = Number(product.price) > 3000;

         }


    return matchesSearch && matchesPrice;

    });


    const categoryName = {
        1: "Men",
        2: "Women"
    };


    const subcategoryName = {
        1: "Running",
        2: "Sneakers",
        3: "Formal",
        5: "Heels",
        6: "Flats"
    };

    const priceName = {
    "under 2000": "Under ₹2000",
    "2000-3000": "₹2000 - ₹3000",
    "above 3000": "Above ₹3000"
};


    const hasFilter =
        category !== "All" ||
        subcategory ||
        price !== "All";



    return (
        <section className="products">

            <div className="products-header">

                <div>

                <h2>
                 {searchTerm.trim()
                  ? `Search Results (${filteredProducts.length})`
                  : "Featured Products"
                 }

                </h2>

                    {searchTerm.trim() && (
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

                    <span className="filter-label">
                        Filters:
                    </span>

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


            {filteredProducts.length > 0 ? (

                <div className="product-list">

                    {filteredProducts.map((product) => (

                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            images={product.images}
                            user={user}
                            setShowLogin={setShowLogin}
                            stock = {product.stock}
                            setCartMessage={setCartMessage}
                            
                        />

                    ))}

                </div>

            ) : (

                <div className="no-products">

                    <h3>No products found</h3>

                    <p>
                        Try changing your search or filters.
                    </p>

                </div>

            )}

        </section>
    );
}

export default Products;