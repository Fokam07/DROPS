import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// 🌿 Navbars
import PublicNavbar from "./components/navbars/PublicNavbar";
import UserNavbar from "./components/navbars/UserNavbar";
import SellerNavbar from "./components/navbars/SellerNavbar";
import AdminNavbar from "./components/navbars/AdminNavbar";
import CategoryNavbar from "./components/navbars/CategoryNavbar";

// 🌍 Pages publiques
import HomePage from "./pages/public/HomePage";
import ProductsPage from "./pages/public/ProductsPage";
import CategoriesPage from "./pages/public/CategoriesPage";
import AboutPage from "./pages/public/AboutPage";
import CategoryProductsPage from "./pages/public/CategoryProductsPage";
import SearchResultsPage from "./pages/public/SearchResultsPage";

// 🔐 Auth
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// 👤 Utilisateur
import UserDashboard from "./pages/user/UserDashboard";
import CartPage from "./pages/user/CartPage";
import OrdersPage from "./pages/user/OrdersPage";
import ReviewsPage from "./pages/user/ReviewsPage";
import SettingsPage from "./pages/user/SettingsPage";
import ProductDetailsPage from "./pages/user/ProductDetailsPage";

// 🧑‍💼 Vendeur
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProductsPage from "./pages/seller/SellerProductsPage";
import SellerOrdersPage from "./pages/seller/SellerOrdersPage";
import SellerProfilePage from "./pages/seller/SellerProfilePage";

// 🧠 Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminSellersPage from "./pages/admin/AdminSellersPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminPaymentsPage from "./pages/admin/AdminPaymentsPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AdminReviewsPage from "./pages/admin/AdminReviewsPage";

/* ======================================================
   🌍 NavbarManager - affiche la barre adaptée au rôle
====================================================== */
function NavbarManager() {
  const [role, setRole] = useState("PUBLIC");
  const [user, setUser] = useState({});
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser?.role) {
      setRole(storedUser.role);
      setUser(storedUser);
    } else {
      setRole("PUBLIC");
      setUser({});
    }
  }, [location]);

  const hideNavbarRoutes = ["/login", "/register"];
  if (hideNavbarRoutes.includes(location.pathname)) return null;

  if (role === "CLIENT") return <UserNavbar userName={user.prenom || "Utilisateur"} />;
  if (role === "VENDEUR") return <SellerNavbar sellerName={user.prenom || "Vendeur"} />;
  if (role === "ADMIN") return <AdminNavbar adminName={user.prenom || "Admin"} />;

  return (
    <>
      <PublicNavbar />
      <CategoryNavbar />
    </>
  );
}

/* ======================================================
   🌍 Loader global (transition entre pages)
====================================================== */
function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="w-10 h-10 border-4 border-dropsGreen border-t-transparent rounded-full animate-spin mb-3"></div>
      <p className="text-dropsDark text-sm font-medium">Chargement...</p>
    </div>
  );
}

/* ======================================================
   🚀 Application principale
====================================================== */
function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

/* ======================================================
   🧩 MainContent avec loader + animation + préchargement images
====================================================== */
function MainContent() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // 🧠 Identifier les pages dashboard
  const isDashboardPage =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/cart") ||
    location.pathname.startsWith("/orders") ||
    location.pathname.startsWith("/reviews") ||
    location.pathname.startsWith("/settings") ||
    location.pathname.startsWith("/seller") ||
    location.pathname.startsWith("/admin");

  // 🌀 Loader de transition entre routes
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      // Attendre aussi le chargement complet des images visibles
      const images = document.querySelectorAll("img");
      const total = images.length;
      if (total === 0) {
        setLoading(false);
        return;
      }
      let loaded = 0;
      images.forEach((img) => {
        if (img.complete) {
          loaded++;
          if (loaded === total) setLoading(false);
        } else {
          img.onload = img.onerror = () => {
            loaded++;
            if (loaded === total) setLoading(false);
          };
        }
      });
    }, 300); // petite latence fluide
    return () => clearTimeout(timeout);
  }, [location]);

  return (
    <div className="min-h-screen bg-smokeWhite font-outfit relative overflow-x-hidden">
      {/* ✅ Navbar dynamique */}
      <NavbarManager />

      {/* 🌀 Loader global */}
      {loading && <PageLoader />}

      {/* ✨ Contenu avec animation et padding ajusté */}
      <div
        className={`${
          isDashboardPage ? "pt-16 sm:pt-24" : "pt-28 sm:pt-36"
        } px-3 sm:px-6 transition-all duration-300`}
      >
        <AnimatePresence mode="wait">
          {!loading && (
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Routes location={location} key={location.pathname}>
                {/* 🌿 Public */}
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/category/:id" element={<CategoryProductsPage />} />
                <Route path="/search" element={<SearchResultsPage />} />

                {/* 🔐 Auth */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* 👤 Utilisateur */}
                <Route path="/dashboard/user" element={<UserDashboard />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/reviews" element={<ReviewsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/products/:id" element={<ProductDetailsPage />} />

                {/* 🧑‍💼 Vendeur */}
                <Route path="/dashboard/seller" element={<SellerDashboard />} />
                <Route path="/seller/products" element={<SellerProductsPage />} />
                <Route path="/seller/orders" element={<SellerOrdersPage />} />
                <Route path="/seller/profile" element={<SellerProfilePage />} />

                {/* 🧠 Admin */}
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/sellers" element={<AdminSellersPage />} />
                <Route path="/admin/products" element={<AdminProductsPage />} />
                <Route path="/admin/orders" element={<AdminOrdersPage />} />
                <Route path="/admin/payments" element={<AdminPaymentsPage />} />
                <Route path="/admin/categories" element={<AdminCategoriesPage />} />
                <Route path="/admin/reviews" element={<AdminReviewsPage />} />

                {/* 🚫 404 */}
                <Route
                  path="*"
                  element={
                    <h1 className="text-center mt-20 text-gray-500">
                      Page introuvable 😢
                    </h1>
                  }
                />
              </Routes>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
