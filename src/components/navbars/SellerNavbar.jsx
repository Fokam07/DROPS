import { Link, useNavigate } from "react-router-dom";
import {
  FaBox,
  FaShoppingBag,
  FaUserCircle,
  FaSignOutAlt,
  FaHome,
} from "react-icons/fa";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function SellerNavbar({ sellerName = "Vendeur" }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md font-outfit">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-4">
          {/* 🏪 LOGO */}
          <Link
            to="/dashboard/seller"
            className="flex items-center gap-2 flex-shrink-0"
          >
            <RiShoppingBag3Fill className="text-dropsGreen text-2xl sm:text-3xl drop-shadow-sm" />
            <span className="font-['Bebas_Neue'] text-xl sm:text-3xl tracking-widest text-dropsDark uppercase hover:text-dropsGreen transition">
              Drops Seller
            </span>
          </Link>

          {/* 💻 Liens principaux (tablette + desktop) */}
          <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium text-sm sm:text-base">
            <Link to="/dashboard/seller" className="hover:text-dropsGreen flex items-center gap-1">
              <FaHome /> Tableau de bord
            </Link>
            <Link to="/seller/products" className="hover:text-dropsGreen flex items-center gap-1">
              <FaBox /> Produits
            </Link>
            <Link to="/seller/orders" className="hover:text-dropsGreen flex items-center gap-1">
              <FaShoppingBag /> Commandes
            </Link>
            <Link to="/seller/profile" className="hover:text-dropsGreen flex items-center gap-1">
              <FaUserCircle /> Profil
            </Link>
          </div>

          {/* 👤 Section droite */}
          <div className="hidden md:flex items-center gap-5">
            <div className="flex items-center gap-2 text-gray-800 font-semibold">
              <FaUserCircle className="text-3xl text-dropsGreen" />
              <span>{sellerName}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition text-sm"
            >
              <FaSignOutAlt /> Déconnexion
            </button>
          </div>

          {/* 📱 Bouton hamburger (mobile uniquement) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-dropsDark text-2xl focus:outline-none"
          >
            {isOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
          </button>
        </div>
      </div>

      {/* 📱 Menu mobile animé */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-sm"
          >
            <div className="px-4 py-4 space-y-3 text-sm text-gray-700 font-medium">
              <NavItem to="/dashboard/seller" icon={<FaHome />} label="Tableau de bord" setIsOpen={setIsOpen} />
              <NavItem to="/seller/products" icon={<FaBox />} label="Produits" setIsOpen={setIsOpen} />
              <NavItem to="/seller/orders" icon={<FaShoppingBag />} label="Commandes" setIsOpen={setIsOpen} />
              <NavItem to="/seller/profile" icon={<FaUserCircle />} label="Profil" setIsOpen={setIsOpen} />

              <div className="pt-3 border-t border-gray-200 flex items-center gap-2">
                <FaUserCircle className="text-dropsGreen text-lg" />
                <span>{sellerName}</span>
              </div>

              <button
                onClick={handleLogout}
                className="mt-2 w-full flex items-center justify-center gap-2 bg-red-500 text-white rounded-full py-2 hover:bg-red-600 transition"
              >
                <FaSignOutAlt /> Déconnexion
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavItem({ to, icon, label, setIsOpen }) {
  return (
    <Link
      to={to}
      onClick={() => setIsOpen(false)}
      className="flex items-center gap-2 hover:text-dropsGreen transition"
    >
      <span className="text-dropsGreen">{icon}</span>
      {label}
    </Link>
  );
}

