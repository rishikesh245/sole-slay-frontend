import { useEffect, useState } from "react";

import {
    getProducts,
    deleteProduct
} from "../../api/productApi";

import "./AdminProducts.css";

import { Link, useNavigate } from "react-router-dom";

import { IoIosAddCircleOutline } from "react-icons/io";


function AdminProducts() {

    const [products, setProducts] = useState([]);

    const [category, setCategory] = useState("All");

    const navigate = useNavigate();


    // =========================================
    // DELETE PRODUCT
    // =========================================

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) {
            return;
        }


        try {

            await deleteProduct(id);


            setProducts((prevProducts) =>
                prevProducts.filter(
                    (product) => product.id !== id
                )
            );


        } catch (error) {

            console.error(
                "DELETE ERROR:",
                error
            );

            console.log(
                "STATUS:",
                error.response?.status
            );

            console.log(
                "MESSAGE:",
                error.response?.data?.message
            );


            alert(
                error.response?.data?.message ||
                "Delete failed"
            );

        }

    };


    // =========================================
    // GET PRODUCTS
    // =========================================

    useEffect(() => {

        getProducts(category)
            .then((response) => {

                console.log(
                    "ADMIN PRODUCTS:",
                    response.data
                );


                setProducts(
                    response.data
                );

            })
            .catch((error) => {

                console.error(
                    "ERROR:",
                    error
                );

            });

    }, [category]);


    // =========================================
    // UI
    // =========================================

    return (

        <div className="admin-products">


            {/* =================================
                HEADING
            ================================= */}

            <div className="product-heading">

                <h2>
                    Product Management
                </h2>

                <div className="admin-heading-buttons"> 
                    <button className="view-store-btn" onClick={() => navigate("/")}>
                        View Store
                    </button>

                </div>


                <Link
                    to="/admin/add-product"
                    className="add-product-link"
                >

                    <IoIosAddCircleOutline
                        className="add-product-icon"
                    />

                </Link>

            </div>


            {/* =================================
                CATEGORY FILTER
            ================================= */}

            <div className="category-filter">

                <button
                    className={
                        category === "All"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setCategory("All")
                    }
                >
                    All
                </button>


                <button
                    className={
                        category === "1"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setCategory("1")
                    }
                >
                    Men
                </button>


                <button
                    className={
                        category === "2"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setCategory("2")
                    }
                >
                    Women
                </button>

            </div>


            {/* =================================
                PRODUCTS
            ================================= */}

            <div className="admin-product-list">

                {products.map((product) => (

                    <div
                        className="admin-product-card"
                        key={product.id}
                    >


                        {/* =================================
                            MAIN PRODUCT IMAGE
                        ================================= */}

                        {product.images?.length > 0 ? (

                            <img
                                src={
                                    product.images[0].image_url
                                }
                                alt={product.name}
                            />

                        ) : (

                            <div className="no-image">
                                No Image
                            </div>

                        )}


                        {/* =================================
                            PRODUCT INFORMATION
                        ================================= */}

                        <div className="admin-product-info">

                            <h3>
                                {product.name}
                            </h3>


                            <p>
                                ₹{product.price}
                            </p>


                            <p>
                                Category:{" "}
                                {
                                    product.Subcategory
                                        ?.Category
                                        ?.name
                                }
                            </p>


                            <p>
                                Subcategory:{" "}
                                {
                                    product.Subcategory
                                        ?.name
                                }
                            </p>


                            <p>
                                Stock: {product.stock}
                            </p>


                            {/* =================================
                                BUTTONS
                            ================================= */}

                            <div className="admin-buttons">


                                {/* EDIT */}

                                <button
                                    className="edit-btn"
                                    onClick={() =>
                                        navigate(
                                            `/admin/edit-product/${product.id}`
                                        )
                                    }
                                >
                                    Edit
                                </button>


                                {/* DELETE */}

                                <button
                                    className="delete-btn"
                                    onClick={() =>
                                        handleDelete(
                                            product.id
                                        )
                                    }
                                >
                                    Delete
                                </button>


                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}


export default AdminProducts;  