import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../../Context/Context.jsx";
import "./ProductDetails.css";

import { getProductById } from "../../api/productApi";


function ProductDetails({user,
    setShowLogi,setCartMessage}
    
) {

    const { id } = useParams();

    const [product, setProduct] = useState(null);

    const { cartItems, setCartItems } = useContext(CartContext);

    const [currentImage, setCurrentImage] = useState(0);


    useEffect(() => {

        getProductById(id)
            .then((response) => {

                console.log(
                    "PRODUCT DETAILS:",
                    response.data
                );

                setProduct(response.data);

            })
            .catch((error) => {

                console.error(
                    "ERROR:",
                    error
                );

            });

    }, [id]);


    // =========================================
    // PRODUCT IMAGES
    // =========================================

    const images =
        product?.images?.map(
            (item) => item.image_url
        ) || [];


    // =========================================
    // ADD TO CART
    // =========================================

    const addToCart = () => {

        const existingProduct = cartItems.find(
            (item) => item.id === product.id
        );


        if (existingProduct) {

            const updatedCart = cartItems.map(
                (item) => {

                    if (item.id === product.id) {

                        return {
                            ...item,
                            quantity: item.quantity + 1
                        };

                    }

                    return item;

                }
            );

            setCartItems(updatedCart);

        } else {

            setCartItems([
                ...cartItems,

                {
                    ...product,
                    image: images[0],
                    quantity: 1
                }

            ]);

        }

    };

        const HandleAddtoCart = () => {
        if (!user){
            setShowLogin(true);
            return;
            
        }

        const existingProduct = cartItems.find(
            (item) => item.id === product.id 
        );

        if (existingProduct) {
            if(existingProduct.quantity >= product.stock) {
                return;
            }
        }

        if (product.stock <= 0) {
            return;
        }

        addToCart();

        if (setCartMessage) {
            setCartMessage(`${product.name} added to cart!`);
        }
    }

    // =========================================
    // LOADING
    // =========================================

    if (!product) {

        return (
            <div className="loading">
                Loading...
            </div>
        );

    }


    return (

        <div className="product-details">


            {/* =================================
                IMAGE SECTION
            ================================= */}

            <div className="product-image">

                <div className="product-image-slider">


                    {/* PREVIOUS */}

                    {images.length > 1 && (

                        <button
                            type="button"
                            className="slider-btn"
                            onClick={() =>
                                setCurrentImage(
                                    currentImage === 0
                                        ? images.length - 1
                                        : currentImage - 1
                                )
                            }
                        >
                            ❮
                        </button>

                    )}


                    {/* MAIN IMAGE */}

                    {images.length > 0 && (

                        <img
                            src={images[currentImage]}
                            alt={product.name}
                            className="product-main-image"
                        />

                    )}


                    {/* NEXT */}

                    {images.length > 1 && (

                        <button
                            type="button"
                            className="slider-btn"
                            onClick={() =>
                                setCurrentImage(
                                    currentImage === images.length - 1
                                        ? 0
                                        : currentImage + 1
                                )
                            }
                        >
                            ❯
                        </button>

                    )}

                </div>


                {/* =================================
                    THUMBNAILS
                ================================= */}

                {images.length > 1 && (

                    <div className="product-thumbnails">

                        {images.map(
                            (image, index) => (

                                <img
                                    key={index}
                                    src={image}
                                    alt={`${product.name} ${index + 1}`}
                                    className={
                                        currentImage === index
                                            ? "thumbnail active"
                                            : "thumbnail"
                                    }
                                    onClick={() =>
                                        setCurrentImage(index)
                                    }
                                />

                            )
                        )}

                    </div>

                )}

            </div>


            {/* =================================
                PRODUCT INFORMATION
            ================================= */}

            <div className="product-details-info">

                <h1>
                    {product.name}
                </h1>


                <p className="price">
                    ₹{product.price}
                </p>


                <p className="category">
                    Category:{" "}
                    {product.Subcategory?.Category?.name}
                </p>


                <p className="subcategory">
                    Subcategory:{" "}
                    {product.Subcategory?.name}
                </p>


                <p className="description">
                    {product.description}
                </p>


            <p 
                className= {
                    product.stock === 0 
                    ? "details-out-of-stock"
                    : product.stock < 3 
                    ? "low-stock"
                    : "stock"
                }
            >
             {product.stock === 0
        ? "Out of Stock"
        : product.stock < 3
        ? `Only ${product.stock} ${
        product.stock === 1 ? "item" : "items"} left`
        : `Stock: ${product.stock}`
    }
            </p>

            {product.stock > 0 ? (<button
                    type="button"
                    className="add-cart-btn"
                    onClick={HandleAddtoCart}
                >
                    Add to Cart
                </button>):(
                    <button type="button"
                            className="add-cart-btn unavailable-btn"
                            disabled
                    >
                                Currently Unavailable

                    </button>) }
                

            </div>

        </div>

    );

}


export default ProductDetails;