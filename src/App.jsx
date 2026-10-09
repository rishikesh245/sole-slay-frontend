import "./App.css";

import { useState } from "react";

import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Navbar from "./components/navbar/Navbar";
import ProductDetails from "./Pages/ProductDetails/ProductDetails";
import Sidebar from "./components/Sidebar/Sidebar";

import Home from "./Pages/Home";

import Cart from "./components/Cart/Cart";
import Checkout from "./Pages/Checkout/Checkout";
import OrderSuccess from "./Pages/OrderSuccess/OrderSuccess";
import MyOrders from "./Pages/MyOrders/MyOrders";

import Login from "./components/Login/Login";

import Addproduct from "./Pages/Admin/AddProduct";
import EditProduct from "./Pages/Admin/EditProduct";
import AdminProducts from "./Pages/Admin/AdminProducts";
import Dashboard from "./Pages/Admin/Dashboard";

import Footer from "./components/Footer/Footer"

function App() {

 

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [subcategory,setSubCategory] = useState("");
  const [price,setPrice] = useState("All")

  const [showLogin, setShowLogin] = useState(false);
  
  const [user, setUser] = useState(() => {

    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      return JSON.parse(savedUser);
    }

    return null;
  });

   const clearFilters = () => {

        setCategory("All");
        setSubCategory("");
        setPrice("All");

    };

  return (
    <>
      <Navbar
        
        setSidebarOpen={setSidebarOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setShowLogin = {setShowLogin}
        user = {user}
        setUser = {setUser}
      />

      {showLogin && (
    <Login setShowLogin={setShowLogin} 
           setUser = {setUser}/>
)}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        category={category}
        onCategoryChange={setCategory}
        onSubcategoryChange={setSubCategory}
        price={price}
        onPriceChange = {setPrice}
        onClearFilters = {clearFilters}
        user={user}
        setUser={setUser}
      />

        <Routes>
        <Route
         path="/"
         element={<Home 
          searchTerm={searchTerm} 
          category={category} 
          subcategory = {subcategory}
          price = {price}
          user = {user}
          setShowLogin={setShowLogin}
          />}
        />

        <Route 
    path="/shop" 
    element={
        <Home  
            searchTerm={searchTerm}  
            category={category}  
            subcategory={subcategory} 
            price={price}
            user={user}
            setShowLogin={setShowLogin}
            isShop={true}
        />
    } 
/>

        <Route
    path="/cart"
    element={
        <Cart
            user={user}
            setShowLogin={setShowLogin}
        />
    }
/>


        <Route 
        path = "/checkout"
        element = {user ?(<Checkout/>):
          (<Login 
            setShowLogin={setShowLogin}
            setUser={setUser} 
            />
          )
        }
        />  

        <Route 
        path = "/order-success"
        element = {<OrderSuccess/>}
        />  

        <Route 
        path = "/my-orders"
        element = {<MyOrders/>}
        />

        <Route
        path="/product/:id"
        element={<ProductDetails
          user = {user}
          setShowLogin = {setShowLogin} />}
        />

        <Route
    path="/admin/dashboard"
    element={
        <ProtectedRoute user={user}>
            <Dashboard />
        </ProtectedRoute>
    }
/>
        
       <Route 
  path="/admin/add-product"
  element={
    <ProtectedRoute user={user}>
      <Addproduct />
    </ProtectedRoute>
  }
/>

<Route 
  path="/admin/edit-product/:id"
  element={
    <ProtectedRoute user={user}>
      <EditProduct />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/products"
  element={
    <ProtectedRoute user={user}>
      <AdminProducts />
    </ProtectedRoute>
  }
/>
</Routes>

      
      <Footer />
     
   
    </>
  );
}

export default App;