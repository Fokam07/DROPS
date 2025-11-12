import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import axios from "axios";
import { API_BASE_URL } from "../../config";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // 🔄 Charger les produits du backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/products`);
        setProducts(res.data);
      } catch {
        setError("Erreur lors du chargement des produits.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 🛒 Ajouter un produit au panier
  const handleAddToCart = async (id_product) => {
    if (!token) {
      alert("Veuillez vous connecter pour ajouter au panier.");
      return;
    }
    try {
      await axios.post(
        `${API_BASE_URL}/api/cart/add`,
        { id_product, quantity: 1 },
        { headers }
      );
      alert("Produit ajouté au panier !");
    } catch {
      alert("Erreur lors de l’ajout au panier.");
    }
  };

  // 🔍 Filtrage
  const filteredProducts = products.filter((p) =>
    (p.nom || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto font-outfit">
      <h1 className="text-3xl font-bold text-dropsDark mb-6 flex items-center gap-2">
        Nos Produits <FaShoppingCart className="text-dropsGreen" />
      </h1>

      {/* 🔍 Barre de recherche */}
      <div className="flex justify-center mb-10">
        <div className="flex items-center bg-white shadow-sm rounded-full px-4 py-2 w-full md:w-1/2 border border-gray-200">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            className="w-full focus:outline-none text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 🧩 Grille produits */}
      {loading ? (
        <p className="text-gray-500 text-center">Chargement des produits...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id_product}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <img
                  src={product.image || "https://via.placeholder.com/400x300"}
                  alt={product.nom}
                  className="w-full h-56 object-cover rounded-t-2xl"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-dropsDark">{product.nom}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                  <p className="text-xl font-bold text-dropsGreen mt-2">
                    {product.prix ? `${product.prix} €` : "—"}
                  </p>
                  <button
                    onClick={() => handleAddToCart(product.id_product)}
                    className="mt-3 w-full bg-dropsGreen text-white py-2 rounded-lg hover:bg-dropsDark transition flex justify-center items-center gap-2"
                  >
                    <FaShoppingCart /> Ajouter au panier
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">Aucun produit trouvé 😢</p>
          )}
        </div>
      )}
    </div>
  );
}

