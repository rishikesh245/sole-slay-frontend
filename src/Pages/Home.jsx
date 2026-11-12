import Hero from "../components/Hero/hero";
import Products from "../components/Products/Products";
import Categories from "../components/Categories/Categories";
import Features from "../components/Features/Features";
import { useProducts } from "../Context/Context";

function Home({ isShop = false }) {
  const { searchTerm, category, subcategory } = useProducts();

  const isSearching = Boolean(searchTerm && searchTerm.trim().length > 0);
  const isFiltering = category !== "All" || Boolean(subcategory);
  const showOnlyProducts = isShop || isSearching || isFiltering;

  return (
    <>
      {showOnlyProducts ? (
        <Products />
      ) : (
        <>
          <Hero />
          <Products />
          <Categories />
          <Features />
        </>
      )}
    </>
  );
}

export default Home;
