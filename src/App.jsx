import "./App.css";
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./Pages/Home";
import Login from "./components/Login/Login";
import Footer from "./components/Footer/Footer";
import ToastContainer from "./components/Toast/ToastContainer";
import { useAuth } from "./Context/Context";

// Route-Level Code Splitting for Ultra-Fast Initial Page Loads
const ProductDetails = lazy(() =>
  import("./Pages/ProductDetails/ProductDetails")
);
const Cart = lazy(() => import("./components/Cart/Cart"));
const Checkout = lazy(() => import("./Pages/Checkout/Checkout"));
const OrderSuccess = lazy(() => import("./Pages/OrderSuccess/OrderSuccess"));
const MyOrders = lazy(() => import("./Pages/MyOrders/MyOrders"));
const Addproduct = lazy(() => import("./Pages/Admin/AddProduct"));
const EditProduct = lazy(() => import("./Pages/Admin/EditProduct"));
const AdminProducts = lazy(() => import("./Pages/Admin/AdminProducts"));
const Dashboard = lazy(() => import("./Pages/Admin/Dashboard"));

function App() {
  const { user, showLogin, closeLogin } = useAuth();

  return (
    <>
      <Navbar />

      {showLogin && <Login onClose={closeLogin} />}

      <Sidebar />

      <Suspense
        fallback={
          <div className="page-loader">
            <div className="spinner"></div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Home isShop={true} />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/login"
            element={<Login initialRegister={false} isFullPage={true} />}
          />
          <Route
            path="/register"
            element={<Login initialRegister={true} isFullPage={true} />}
          />
          <Route
            path="/checkout"
            element={user ? <Checkout /> : <Login isFullPage={true} />}
          />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* Admin Protected Routes */}
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
      </Suspense>

      <Footer />

      {/* Global Real-Time Toast Notifications */}
      <ToastContainer />
    </>
  );
}

export default App;
