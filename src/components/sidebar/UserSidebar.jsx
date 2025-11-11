import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaHome,
  FaShoppingCart,
  FaClipboardList,
  FaCommentDots,
  FaCog,
  FaSignOutAlt,
  FaTags,
} from "react-icons/fa";

export default function UserSidebar() {
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 🔹 Charger infos utilisateur
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    // 🔹 Charger catégories
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

  const handleCategoryClick = (id_category) => {
    navigate(`/dashboard/user?category=${id_category}`);
  };

  const linkClass = (path) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      location.pathname === path
        ? "bg-dropsGreen text-white shadow-md"
        : "text-gray-700 hover:bg-dropsGreen/10 hover:text-dropsGreen"
    }`;

  return (
    <aside
      className="
        hidden md:flex 
        fixed left-0 top-[64px]
        w-64 h-[calc(100vh-64px)]
        bg-white shadow-lg border-r border-gray-100 
        flex-col justify-between font-outfit
        transition-all duration-300
      "
    >
      {/* ======== Haut de la sidebar ======== */}
      <div className="p-5 border-b border-gray-100">
        {/* 👤 Profil utilisateur */}
        <div className="flex items-center space-x-3 mb-3">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="user"
            className="w-10 h-10 rounded-full border border-gray-200"
          />
          <div>
            <p className="font-semibold text-dropsDark text-sm">
              {user?.prenom || "Invité"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || "Non connecté"}
            </p>
          </div>
        </div>

        {/* 🧭 Liens principaux */}
        <nav className="space-y-1 mt-4">
          <Link to="/dashboard/user" className={linkClass("/dashboard/user")}>
            <FaHome /> Accueil
          </Link>
          <Link to="/cart" className={linkClass("/cart")}>
            <FaShoppingCart /> Mon panier
          </Link>
          <Link to="/orders" className={linkClass("/orders")}>
            <FaClipboardList /> Mes commandes
          </Link>
          <Link to="/reviews" className={linkClass("/reviews")}>
            <FaCommentDots /> Mes avis
          </Link>
          <Link to="/settings" className={linkClass("/settings")}>
            <FaCog /> Paramètres
          </Link>
        </nav>
      </div>

      {/* ======== Catégories ======== */}
      <div className="flex-1 overflow-y-auto p-5 border-b border-gray-100">
        <h3 className="flex items-center gap-2 font-semibold text-gray-700 mb-3">
          <FaTags className="text-dropsGreen" /> Catégories
        </h3>
        <div className="max-h-52 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-gray-300">
          {categories.map((cat) => (
            <button
              key={cat.id_category}
              onClick={() => handleCategoryClick(cat.id_category)}
              className="block w-full text-left text-sm text-gray-600 hover:text-dropsGreen transition"
            >
              • {cat.nom}
            </button>
          ))}
        </div>
      </div>

      {/* ======== Bouton Déconnexion ======== */}
      <div className="p-5">
        <button
          onClick={handleLogout}
          className="
            w-full flex items-center justify-center gap-2
            bg-red-500 hover:bg-red-600 text-white
            font-medium rounded-lg py-2.5
            shadow-md transition-all duration-300
          "
        >
          <FaSignOutAlt /> Déconnexion
        </button>
      </div>
    </aside>
  );
}


