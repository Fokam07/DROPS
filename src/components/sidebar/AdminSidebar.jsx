import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaStore,
  FaBoxOpen,
  FaClipboardList,
  FaMoneyCheckAlt,
  FaTags,
  FaComments,
  FaSignOutAlt,
} from "react-icons/fa";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Fonction pour savoir si le lien est actif
  const isActive = (path) => location.pathname === path;

  return (
    // ✅ Sidebar visible seulement sur desktop
    <aside
      className="
        hidden md:flex fixed left-0 top-[64px]
        h-[calc(100vh-64px)] w-64
        bg-white shadow-lg border-r border-gray-100
        flex-col justify-between font-outfit z-40
        transition-all duration-300
      "
    >
      {/* ======= Haut de la sidebar ======= */}
      <div className="p-5 border-b border-gray-100">
        <h1 className="text-2xl font-extrabold text-dropsDark">
          <span className="text-dropsGreen">Admin</span> Drops
        </h1>
        <p className="text-xs text-gray-400 mt-1 tracking-wide">
          Tableau de bord principal
        </p>
      </div>

      {/* ======= Liens de navigation ======= */}
      <nav className="flex-1 p-4 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-gray-200">
        <SidebarLink
          to="/dashboard/admin"
          icon={<FaTachometerAlt />}
          label="Dashboard"
          active={isActive("/dashboard/admin")}
        />
        <SidebarLink
          to="/admin/users"
          icon={<FaUsers />}
          label="Utilisateurs"
          active={isActive("/admin/users")}
        />
        <SidebarLink
          to="/admin/sellers"
          icon={<FaStore />}
          label="Vendeurs"
          active={isActive("/admin/sellers")}
        />
        <SidebarLink
          to="/admin/products"
          icon={<FaBoxOpen />}
          label="Produits"
          active={isActive("/admin/products")}
        />
        <SidebarLink
          to="/admin/categories"
          icon={<FaTags />}
          label="Catégories"
          active={isActive("/admin/categories")}
        />
        <SidebarLink
          to="/admin/orders"
          icon={<FaClipboardList />}
          label="Commandes"
          active={isActive("/admin/orders")}
        />
        <SidebarLink
          to="/admin/payments"
          icon={<FaMoneyCheckAlt />}
          label="Paiements"
          active={isActive("/admin/payments")}
        />
        <SidebarLink
          to="/admin/reviews"
          icon={<FaComments />}
          label="Avis Produits"
          active={isActive("/admin/reviews")}
        />
      </nav>

      {/* ======= Bouton Déconnexion ======= */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="
            w-full flex items-center justify-center gap-2
            bg-red-500 hover:bg-red-600
            text-white font-medium rounded-lg py-2.5
            shadow-md transition-all duration-300
          "
        >
          <FaSignOutAlt className="text-lg" /> Déconnexion
        </button>
      </div>
    </aside>
  );
}

/* === Composant Lien Sidebar === */
function SidebarLink({ to, icon, label, active }) {
  return (
    <Link
      to={to}
      className={`
        flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
        transition-all duration-300
        ${
          active
            ? "bg-dropsGreen text-white shadow-sm"
            : "text-gray-700 hover:bg-dropsGreen/10 hover:text-dropsGreen"
        }
      `}
    >
      <span className={`text-lg ${active ? "text-white" : "text-dropsGreen"}`}>
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}

