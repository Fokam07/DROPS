import { Link, useNavigate } from "react-router-dom";
import { RiShoppingBag3Fill } from "react-icons/ri";
import {
  FaShoppingCart,
  FaClipboardList,
  FaCommentDots,
  FaCog,
  FaTags,
  FaHome,
} from "react-icons/fa";
import { HiOutlineUserCircle, HiOutlineLogout } from "react-icons/hi";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import useCartCount from "../../hooks/useCartCount";

export default function UserNavbar({ userName = "Utilisateur" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const cartCount = useCartCount();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/categories")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md font-outfit">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* 🛍️ LOGO */}
          <Link to="/" className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <RiShoppingBag3Fill className="text-dropsGreen text-xl sm:text-3xl drop-shadow-sm" />
            <span className="font-['Bebas_Neue'] text-lg sm:text-3xl tracking-widest text-dropsDark uppercase hover:text-dropsGreen transition">
              DROPS
            </span>
          </Link>

          {/* 🧑‍💼 Section utilisateur */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* 🛒 Panier dynamique */}
            <Link to="/cart" className="relative text-dropsDark hover:text-dropsGreen transition">
              <FaShoppingCart className="text-xl sm:text-2xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-dropsGreen text-white text-xs rounded-full px-1.5">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* 👤 Nom utilisateur + avatar */}
            <div className="hidden sm:flex items-center gap-2 text-gray-800 font-semibold">
              <HiOutlineUserCircle className="text-2xl sm:text-3xl text-dropsGreen" />
              <span className="text-sm sm:text-base">{userName}</span>
            </div>

            {/* 📱 Menu burger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-dropsDark text-xl sm:text-2xl focus:outline-none"
            >
              {menuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* 📱 Menu mobile animé */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-sm font-outfit"
          >
            <div className="px-4 py-4 space-y-3 text-sm sm:text-base text-gray-700 font-medium">
              {/* 🏠 Lien vers le dashboard */}
              <Link
                to="/dashboard/user"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 py-1 hover:text-dropsGreen transition"
              >
                <FaHome className="text-dropsGreen" /> Tableau de bord
              </Link>

              {/* 📦 Commandes */}
              <Link
                to="/orders"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 py-1 hover:text-dropsGreen transition"
              >
                <FaClipboardList className="text-dropsGreen" /> Mes commandes
              </Link>

              {/* 💬 Avis */}
              <Link
                to="/reviews"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 py-1 hover:text-dropsGreen transition"
              >
                <FaCommentDots className="text-dropsGreen" /> Mes avis
              </Link>

              {/* ⚙️ Paramètres */}
              <Link
                to="/settings"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 py-1 hover:text-dropsGreen transition"
              >
                <FaCog className="text-dropsGreen" /> Paramètres
              </Link>

              {/* 🏷️ Catégories */}
              <div className="pt-2 border-t border-gray-200">
                <p className="flex items-center gap-2 font-semibold text-gray-700 mb-1">
                  <FaTags className="text-dropsGreen" /> Catégories
                </p>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id_category}
                      onClick={() => {
                        navigate(`/dashboard/user?category=${cat.id_category}`);
                        setMenuOpen(false);
                      }}
                      className="w-full text-left text-sm text-gray-600 hover:text-dropsGreen transition"
                    >
                      • {cat.nom}
                    </button>
                  ))}
                </div>
              </div>

              {/* 🚪 Déconnexion */}
              <button
                onClick={handleLogout}
                className="mt-3 flex items-center gap-2 w-full justify-center bg-red-500 text-white text-sm rounded-full py-2 hover:bg-red-600 transition shadow-md"
              >
                <HiOutlineLogout className="text-base" /> Déconnexion
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}






