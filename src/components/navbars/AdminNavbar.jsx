import { Link, useNavigate } from "react-router-dom";
import {
  FaUserShield,
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
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function AdminNavbar({ adminName = "Admin" }) {
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
          {/* 🛡️ LOGO */}
          <Link
            to="/dashboard/admin"
            className="flex items-center gap-2 flex-shrink-0"
          >
            <FaUserShield className="text-dropsGreen text-2xl sm:text-3xl drop-shadow-sm" />
            <span className="font-['Bebas_Neue'] text-xl sm:text-3xl tracking-widest text-dropsDark uppercase hover:text-dropsGreen transition">
              Drops Admin
            </span>
          </Link>

          {/* 💻 Liens desktop */}
          <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium text-sm sm:text-base">
            <NavLink to="/dashboard/admin" icon={<FaTachometerAlt />} label="Dashboard" />
            <NavLink to="/admin/users" icon={<FaUsers />} label="Utilisateurs" />
            <NavLink to="/admin/sellers" icon={<FaStore />} label="Vendeurs" />
            <NavLink to="/admin/products" icon={<FaBoxOpen />} label="Produits" />
            <NavLink to="/admin/categories" icon={<FaTags />} label="Catégories" />
            <NavLink to="/admin/orders" icon={<FaClipboardList />} label="Commandes" />
            <NavLink to="/admin/payments" icon={<FaMoneyCheckAlt />} label="Paiements" />
            <NavLink to="/admin/reviews" icon={<FaComments />} label="Avis" />
          </div>

          {/* 👤 Profil + Déconnexion */}
          <div className="hidden md:flex items-center gap-5">
            <div className="flex items-center gap-2 text-gray-800 font-semibold">
              <FaUserShield className="text-3xl text-dropsGreen" />
              <span>{adminName}</span>
            </div>

            
          </div>

          {/* 📱 Menu burger (mobile) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-dropsDark text-2xl focus:outline-none"
          >
            {isOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
          </button>
        </div>
      </div>

      {/* 📱 Menu mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-sm"
          >
            <div className="px-4 py-5 space-y-3 text-sm text-gray-700 font-medium">
              <NavItem to="/dashboard/admin" icon={<FaTachometerAlt />} label="Dashboard" setIsOpen={setIsOpen} />
              <NavItem to="/admin/users" icon={<FaUsers />} label="Utilisateurs" setIsOpen={setIsOpen} />
              <NavItem to="/admin/sellers" icon={<FaStore />} label="Vendeurs" setIsOpen={setIsOpen} />
              <NavItem to="/admin/products" icon={<FaBoxOpen />} label="Produits" setIsOpen={setIsOpen} />
              <NavItem to="/admin/categories" icon={<FaTags />} label="Catégories" setIsOpen={setIsOpen} />
              <NavItem to="/admin/orders" icon={<FaClipboardList />} label="Commandes" setIsOpen={setIsOpen} />
              <NavItem to="/admin/payments" icon={<FaMoneyCheckAlt />} label="Paiements" setIsOpen={setIsOpen} />
              <NavItem to="/admin/reviews" icon={<FaComments />} label="Avis" setIsOpen={setIsOpen} />

              {/* 👤 Profil mini */}
              <div className="pt-4 border-t border-gray-200 flex items-center gap-2 justify-center">
                <FaUserShield className="text-dropsGreen text-lg" />
                <span className="font-semibold">{adminName}</span>
              </div>

              {/* 🚪 Déconnexion (corrigé) */}
              <button
                onClick={handleLogout}
                className="mt-3 mx-auto w-full max-w-[200px] flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition text-center shadow-md"
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

function NavLink({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="hover:text-dropsGreen flex items-center gap-1 transition"
    >
      <span className="text-dropsGreen">{icon}</span> {label}
    </Link>
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


