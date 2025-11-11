import { Link, useNavigate } from "react-router-dom";
import { FaGlobe, FaSearch } from "react-icons/fa";
import { HiOutlineUserCircle } from "react-icons/hi";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { GiShoppingBag } from "react-icons/gi";
import { AiOutlineMenu } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function PublicNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(search)}`);
      setSearch("");
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md font-outfit">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <RiShoppingBag3Fill className="text-dropsGreen text-xl sm:text-3xl drop-shadow-sm" />
            <span className="font-['Bebas_Neue'] text-lg sm:text-3xl tracking-widest text-dropsDark uppercase hover:text-dropsGreen transition">
              DROPS
            </span>
          </Link>

          {/* Barre de recherche */}
          <form
            onSubmit={handleSearch}
            className="flex-1 flex items-center justify-center max-w-[150px] xs:max-w-[200px] sm:max-w-md md:max-w-lg"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-3 pr-8 py-1 sm:py-2 text-[11px] sm:text-sm rounded-full border border-gray-200 focus:border-dropsGreen focus:ring-1 focus:ring-dropsGreen/20 outline-none transition"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-dropsGreen text-white p-1 rounded-full hover:bg-dropsDark transition"
              >
                <FaSearch className="text-[10px] sm:text-xs" />
              </button>
            </div>
          </form>

          {/* Liens Desktop */}
          <div className="hidden lg:flex items-center space-x-5 text-gray-700 font-semibold text-sm sm:text-base flex-shrink-0">
            <Link to="/" className="hover:text-dropsGreen transition flex items-center gap-1.5">
              <GiShoppingBag className="text-base sm:text-lg" /> Accueil
            </Link>
            <Link to="/about" className="hover:text-dropsGreen transition">
              À propos
            </Link>
            <button className="flex items-center gap-1.5 text-gray-700 hover:text-dropsGreen transition">
              <span className="text-base">🇫🇷</span>
              <FaGlobe className="text-sm sm:text-base" /> FR / €
            </button>
          </div>

          {/* Connexion */}
          <Link
            to="/login"
            className="hidden md:flex items-center gap-1.5 px-4 py-1.5 bg-dropsGreen text-white text-sm rounded-full hover:bg-dropsDark transition shadow-md flex-shrink-0"
          >
            <HiOutlineUserCircle className="text-lg" />
            Connexion
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-dropsDark text-xl sm:text-2xl flex-shrink-0"
          >
            <AiOutlineMenu />
          </button>
        </div>
      </div>

      {/* Menu Mobile animé */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-sm"
          >
            <div className="px-4 py-3 space-y-2 text-sm">
              <Link to="/" onClick={() => setMenuOpen(false)} className="block py-1 hover:text-dropsGreen transition">
                <GiShoppingBag className="inline mr-1" /> Accueil
              </Link>
              <Link to="/about" onClick={() => setMenuOpen(false)} className="block py-1 hover:text-dropsGreen transition">
                À propos
              </Link>
              <button className="flex items-center gap-1 text-gray-700 hover:text-dropsGreen transition">
                <span>🇫🇷</span>
                <FaGlobe className="text-xs" /> FR / €
              </button>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-1 text-dropsGreen font-semibold">
                Connexion
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}



