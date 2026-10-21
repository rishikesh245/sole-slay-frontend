import Hero from "../components/Hero/hero";
import Products from "../components/Products/Products";
import Categories from "../components/Categories/Categories";
import Features from "../components/Features/Features";

function Home({
    searchTerm = "",
    category = "All",
    subcategory = "",
    price = "All",
    user,
    setShowLogin,
    setCartMessage,
    isShop = false
}) {

  

    const isSearching = searchTerm.trim().length > 0;

    const isFiltering =
        category !== "All" || subcategory !== "";

    const showOnlyProducts =
        isShop || isSearching || isFiltering;

    return (
        <>
            {showOnlyProducts ? (

                <Products
                    searchTerm={searchTerm}
                    category={category}
                    subcategory={subcategory}
                    price = {price}
                    user = {user}
                    setShowLogin={setShowLogin}
                    setCartMessage={setCartMessage}
            

                    
                />

            ) : (

                <>
                    <Hero />

                    <Products
                        searchTerm={searchTerm}
                        category={category}
                        subcategory={subcategory}
                        price = {price}
                        user = {user}
                        setShowLogin={setShowLogin}
                        setCartMessage={setCartMessage}
                        
                    />

                    <Categories />

                    <Features />
                </>

            )}
        </>
    );
}

export default Home;