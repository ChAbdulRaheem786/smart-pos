import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";

import UserLayout from "./components/user/UserLayout";
import Home from "./pages/user/Home";
import CategoryPage from "./pages/user/CategoryPage";
import ProductPage from "./pages/user/ProductPage";
import CartPage from "./pages/user/CartPage";
import CheckoutPage from "./pages/user/CheckoutPage";
import OrderSuccessPage from "./pages/user/OrderSuccessPage";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageOrders from "./pages/admin/ManageOrders";
import ManageSettings from "./pages/admin/ManageSettings";

function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <h1 className="font-display text-2xl font-semibold">Page not found</h1>
      <a href="/" className="mt-4 inline-block text-brand-dark underline">Back to shop</a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <CartProvider>
          <Routes>
            {/* User panel — no authentication required */}
            <Route element={<UserLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
            </Route>

            {/* Admin panel — password protected, lives at /admin */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route element={<ProtectedAdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/categories" element={<ManageCategories />} />
                <Route path="/admin/products" element={<ManageProducts />} />
                <Route path="/admin/orders" element={<ManageOrders />} />
                <Route path="/admin/settings" element={<ManageSettings />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </CartProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
