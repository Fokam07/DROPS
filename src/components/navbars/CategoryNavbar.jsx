import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaSoap,
  FaPumpSoap,
  FaHeartbeat,
  FaTooth,
  FaTshirt,
  FaHome,
  FaSpa,
  FaGift,
} from "react-icons/fa";
import axios from "axios";

export default function CategoryNavbar() {
  const [categories, setCategories] = useState([]);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/categories")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));

    // 🎯 Ajoute un effet sticky / shadow dynamique
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🧠 Mapping icônes selon le nom (sans accents)
  const categoryIcons = {
    "hygiène corporelle": <FaSoap />,
    "soins capillaires": <FaPumpSoap />,
    "santé & bien-être": <FaHeartbeat />,
    "hygiène bucco-dentaire": <FaTooth />,
    "mode & accessoires": <FaTshirt />,
    "maison & entretien": <FaHome />,
    "cosmétique & beauté": <FaSpa />,
  };

  const getCategoryIcon = (name) => {
    if (!name) return <FaGift />;
    const key = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return categoryIcons[key] || <FaGift />;
  };

  const scroll = (dir) => {
    const el = document.getElementById("category-scroll");
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  return (
    <div
      className={`fixed left-0 w-full z-40 transition-all duration-300 ${
        isSticky ? "top-[55px] shadow-lg" : "top-[60px] sm:top-[70px]"
      } bg-dropsGreen`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-1 sm:py-2 relative">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Bouton gauche (desktop uniquement) */}
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex items-center justify-center w-7 h-7 bg-white/20 rounded-full hover:bg-white/30 transition flex-shrink-0"
          >
            <FaChevronLeft className="text-white text-xs sm:text-sm" />
          </button>

          {/* Liste scrollable */}
          <div
            id="category-scroll"
            className="flex-1 overflow-x-auto scrollbar-hide touch-pan-x"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex gap-1.5 sm:gap-3 items-center">
              <Link
                to="/products"
                className="flex items-center gap-1 text-white font-semibold text-[11px] sm:text-sm hover:bg-white/20 px-3 py-1 sm:px-4 sm:py-2 rounded-full transition whitespace-nowrap flex-shrink-0"
              >
                <FaGift className="text-xs sm:text-base" /> Tous
              </Link>

              {categories.map((cat) => (
                <Link
                  key={cat.id_category}
                  to={`/category/${cat.id_category}`}
                  className="flex items-center gap-1 text-white font-semibold text-[11px] sm:text-sm hover:bg-white/20 px-3 py-1 sm:px-4 sm:py-2 rounded-full transition whitespace-nowrap flex-shrink-0"
                >
                  <span className="text-xs sm:text-sm">
                    {getCategoryIcon(cat.nom)}
                  </span>
                  <span className="truncate max-w-[90px] sm:max-w-none">
                    {cat.nom}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Bouton droite */}
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex items-center justify-center w-7 h-7 bg-white/20 rounded-full hover:bg-white/30 transition flex-shrink-0"
          >
            <FaChevronRight className="text-white text-xs sm:text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}





