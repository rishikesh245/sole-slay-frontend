import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../Context/Context.jsx";


function ProductCard({
    id,
    name,
    price,
    images = [],
    user,
    setShowLogin,
    stock
}) {

    const { cartItems, setCartItems } = useContext(CartContext);

    const navigate = useNavigate();

    const [currentImage, setCurrentImage] = useState(0);




    // Convert ProductImage objects
    // into normal image URLs

    const productImages = images.map(
        (item) => item.image_url
    );


    // ADD TO CART
  

    const addToCart = () => {

        const existingProduct = cartItems.find(
            (item) => item.id === id
        );


        if (existingProduct) {

            const updatedCart = cartItems.map((item) => {

                if (item.id === id) {

                    return {
                        ...item,
                        quantity: item.quantity + 1
                    };

                }

                return item;

            });

            setCartItems(updatedCart);

        } else {

            const newProduct = {

                id: id,

                name: name,

                price: price,

                image: productImages[0],

                quantity: 1

            };

            setCartItems([
                ...cartItems,
                newProduct
            ]);

        }

    };


      const HandleAddtoCart = () => {
        if (!user){
            setShowLogin(true);
            return;
            
        }

        addToCart();
    }

    // PREVIOUS IMAGE

    const previousImage = () => {

        setCurrentImage((prev) => {

            if (prev === 0) {

                return productImages.length - 1;

            }

            return prev - 1;

        });

    };


    // NEXT IMAGE

    const nextImage = () => {

        setCurrentImage((prev) => {

            if (prev === productImages.length - 1) {

                return 0;

            }

            return prev + 1;

        });

    };


    return (

        <div className="product-card">


            {/* IMAGE SLIDER */}

            <div className="product-card-image">


                {productImages.length > 0 && (

                    <img
                        src={productImages[currentImage]}
                        alt={name}
                        className= {Number(stock) === 0 ? "out-of-stock-image": ""}
                    />

                )}

                {Number(stock) === 0 && (
                 <span className="out-of-stock-badge">
                  OUT OF STOCK
                </span>
                )}

         


                {/* SLIDER BUTTONS */}

                {productImages.length > 1 && (

                    <>

                        <button
                            type="button"
                            className="card-slider-btn card-prev"
                            onClick={previousImage}
                        >
                            ❮
                        </button>


                        <button
                            type="button"
                            className="card-slider-btn card-next"
                            onClick={nextImage}
                        >
                            ❯
                        </button>

                    </>

                )}

            </div>


            {/* PRODUCT NAME */}

            <h3>
                {name}
            </h3>


            {/* PRICE */}

            <p>
                ₹{price}
            </p>


            {/* BUTTONS */}

            <div className="two-buttons">

                {stock > 0 ? (<button
                    type="button"
                    className="add-cart-card-btn"
                    onClick={HandleAddtoCart}>
               
                    Add to Cart
                </button>):(
                    <button type = "button"
                            className="notify-btn"
                            disabled>
                         🔔 Notify Me

                    </button>
                ) }
            


                <button
                    type="button"
                    className="view-details-btn"
                    onClick={() =>
                        navigate(`/product/${id}`)
                    }
                >
                    View Details
                </button>

            </div>


        </div>

    );

}

export default ProductCard;