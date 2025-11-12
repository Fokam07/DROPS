import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar, FaTrashAlt, FaSearch } from "react-icons/fa";
import AdminSidebar from "../../components/sidebar/AdminSidebar";
import { API_BASE_URL } from "../../config";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState(""); // 🔍 Recherche
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // 🔹 Charger les avis
  const fetchAll = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/reviews`, { headers });
      setReviews(res.data);
    } catch {
      setError("Erreur lors du chargement des avis.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔹 Supprimer un avis
  const handleDelete = async (id_review) => {
    if (!window.confirm("Supprimer cet avis ?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/reviews/${id_review}`, { headers });
      setReviews(reviews.filter((r) => r.id_review !== id_review));
    } catch {
      alert("Erreur lors de la suppression.");
    }
  };

  // 🔍 Filtrage dynamique
  const filteredReviews = reviews.filter(
    (r) =>
      (r.user?.nom?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (r.user?.prenom?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (r.product?.nom?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (r.commentaire?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-smokeWhite font-outfit">
      <AdminSidebar />

      <main className="flex-1 ml-0 md:ml-64 p-6 md:p-8 w-full md:w-[calc(100%-16rem)] transition-all duration-300">
        <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-dropsDark mb-6 flex items-center gap-3">
          <FaStar className="text-dropsGreen" /> Gestion des avis produits
        </h1>

        {/* 🔍 Barre de recherche */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex items-center gap-3">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un avis (utilisateur, produit ou commentaire)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full focus:outline-none"
          />
        </div>

        {/* 📋 Table des avis */}
        {loading ? (
          <p className="text-gray-500">Chargement des avis...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow-md">
            <table className="min-w-full border-collapse">
              <thead className="bg-dropsGreen text-white">
                <tr>
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">Utilisateur</th>
                  <th className="py-3 px-4 text-left">Produit</th>
                  <th className="py-3 px-4 text-left">Note</th>
                  <th className="py-3 px-4 text-left">Commentaire</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      Aucun avis trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((r, i) => (
                    <tr key={r.id_review} className="border-b hover:bg-gray-50 transition">
                      <td className="py-3 px-4">{i + 1}</td>
                      <td className="py-3 px-4">
                        {r.user ? `${r.user.prenom} ${r.user.nom}` : "—"}
                      </td>
                      <td className="py-3 px-4">{r.product?.nom || "—"}</td>
                      <td className="py-3 px-4 text-yellow-500 font-bold">{r.note} ★</td>
                      <td className="py-3 px-4">{r.commentaire || "—"}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDelete(r.id_review)}
                          className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}


