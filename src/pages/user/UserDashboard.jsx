import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import UserSidebar from "../../components/sidebar/UserSidebar";
import { FaShoppingCart, FaSearch, FaFilter } from "react-icons/fa";
import StarRating from "../../components/StarRating";

export default function UserDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category_id: "",
    min_price: "",
    max_price: "",
  });
  const navigate = useNavigate();
  const location = useLocation();

  // 🔍 Charger les produits selon filtres + catégorie URL
  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = "http://localhost:8000/api/products/search?";
      const queryParams = new URLSearchParams();

      if (searchQuery.trim()) queryParams.append("q", searchQuery);
      if (filters.category_id) queryParams.append("category_id", filters.category_id);
      if (filters.min_price) queryParams.append("min_price", filters.min_price);
      if (filters.max_price) queryParams.append("max_price", filters.max_price);

      url += queryParams.toString();

      const res = await axios.get(url);
      setProducts(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      console.error("Erreur produits :", err);
      setError("Impossible de charger les produits pour le moment.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // 📦 Charger les catégories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/categories/");
      setCategories(res.data);
    } catch (err) {
      console.error("Erreur catégories :", err);
    }
  };

  // 🎯 Met à jour les produits selon la catégorie dans l’URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    if (category) {
      setFilters((prev) => ({ ...prev, category_id: category }));
      setSearchQuery("");
    }
  }, [location.search]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [filters.category_id]);

  const handleAddToCart = async (id_product) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      await axios.post(
        `http://localhost:8000/api/cart/add/${id_product}`,
        { quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Produit ajouté au panier !");
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de l’ajout au panier.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setShowFilters(false);
    fetchProducts();
  };

  const clearFilters = () => {
    setFilters({ category_id: "", min_price: "", max_price: "" });
    fetchProducts();
  };

  return (
    <div className="flex min-h-screen bg-[#F5F7FA] font-outfit">
      <UserSidebar />

      <main className="flex-1 px-3 sm:px-6 md:px-10 py-4 w-full md:ml-64 flex justify-center transition-all duration-300">
        <div className="w-full max-w-7xl">
          {/* 🔍 Barre de recherche & filtres */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-white border border-gray-200 rounded-full shadow-sm overflow-hidden w-full sm:w-[350px] focus-within:ring-2 focus-within:ring-dropsGreen transition"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit..."
                className="flex-1 px-4 py-2 text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="bg-dropsGreen text-white px-4 py-2 flex items-center justify-center hover:bg-dropsDark transition"
              >
                <FaSearch className="text-sm" />
              </button>
            </form>

            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full shadow-sm text-gray-700 hover:text-dropsGreen hover:border-dropsGreen transition text-sm"
            >
              <FaFilter /> Filtres
            </button>
          </div>

          {/* 🎛️ Menu déroulant des filtres */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-gray-200 shadow-lg rounded-xl p-5 mb-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Catégorie */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Catégorie
                    </label>
                    <select
                      name="category_id"
                      value={filters.category_id}
                      onChange={handleFilterChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-dropsGreen focus:outline-none"
                    >
                      <option value="">Toutes les catégories</option>
                      {categories.map((cat) => (
                        <option key={cat.id_category} value={cat.id_category}>
                          {cat.nom}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Prix min */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix minimum (€)
                    </label>
                    <input
                      type="number"
                      name="min_price"
                      value={filters.min_price}
                      onChange={handleFilterChange}
                      placeholder="0"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-dropsGreen focus:outline-none"
                    />
                  </div>

                  {/* Prix max */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix maximum (€)
                    </label>
                    <input
                      type="number"
                      name="max_price"
                      value={filters.max_price}
                      onChange={handleFilterChange}
                      placeholder="1000"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-dropsGreen focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  >
                    Réinitialiser
                  </button>
                  <button
                    onClick={applyFilters}
                    className="px-4 py-2 text-sm bg-dropsGreen text-white rounded-lg hover:bg-dropsDark transition"
                  >
                    Appliquer
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 🌀 Loader / Erreur */}
          {loading && (
            <p className="text-gray-500 text-center text-lg">
              Chargement des produits...
            </p>
          )}
          {error && <p className="text-red-500 text-center text-lg">{error}</p>}

          {/* 🛒 Liste produits */}
          {!loading && !error && products.length === 0 && (
            <p className="text-center text-gray-500 text-lg">
              Aucun produit trouvé.
            </p>
          )}

          {!loading && !error && products.length > 0 && (
  <motion.div
    className="
      grid
      grid-cols-2
      sm:grid-cols-3
      md:grid-cols-4
      lg:grid-cols-5
      xl:grid-cols-5
      gap-3 sm:gap-4 md:gap-5
    "
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
      },
    }}
  >
    {products.map((prod) => (
      <motion.div
        key={prod.id_product}
        className="
          bg-white rounded-xl shadow-sm hover:shadow-lg
          transition-all duration-300 p-3
          relative group border border-gray-100
          flex flex-col justify-between
        "
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* 🖼️ Image carré */}
        <div className="overflow-hidden rounded-lg mb-2 aspect-square">
          <img
            src={
              prod.image && prod.image.startsWith("http")
                ? prod.image
                : `http://localhost:8000/uploads/${prod.image}`
            }
            alt={prod.nom}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* 🏷️ Nom produit */}
        <h3 className="font-semibold text-sm sm:text-base text-dropsDark truncate">
          {prod.nom}
        </h3>

        {/* ⭐ Avis */}
        <div className="flex items-center mt-1 mb-1">
          <StarRating value={prod.note_moyenne || 5} />
          <span className="text-gray-500 text-xs ml-1">
            ({prod.nb_reviews || 0})
          </span>
        </div>

        {/* 💬 Description courte */}
        <p className="text-gray-600 text-xs line-clamp-2 mb-2">
          {prod.description}
        </p>

        {/* 💰 Prix + Panier */}
        <div className="flex justify-between items-center mt-auto">
          <span className="text-dropsGreen font-bold text-sm sm:text-base">
            {prod.prix} €
          </span>
          <button
            onClick={() => handleAddToCart(prod.id_product)}
            className="p-2 bg-dropsGreen text-white rounded-full hover:bg-dropsDark transition"
          >
            <FaShoppingCart className="text-xs sm:text-sm" />
          </button>
        </div>

        {/* 🔗 Lien global */}
        <Link
          to={`/products/${prod.id_product}`}
          className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/10 transition"
        ></Link>
      </motion.div>
    ))}
  </motion.div>
)}

        </div>
      </main>
    </div>
  );
}
