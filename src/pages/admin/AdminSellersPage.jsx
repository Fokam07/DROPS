import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStore, FaTrashAlt, FaToggleOn, FaToggleOff, FaSearch } from "react-icons/fa";
import AdminSidebar from "../../components/sidebar/AdminSidebar";
import { API_BASE_URL } from "../../config";

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState([]);
  const [search, setSearch] = useState(""); // 🔍 Recherche
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchSellers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/sellers`, { headers });
      setSellers(res.data);
    } catch {
      setError("Erreur lors du chargement des vendeurs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleActive = async (id_user, active) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/admin/sellers/${id_user}/toggle`,
        { active: !active },
        { headers }
      );
      fetchSellers();
    } catch {
      alert("Erreur lors du changement de statut.");
    }
  };

  const handleDelete = async (id_user) => {
    if (!window.confirm("Supprimer ce vendeur ?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/sellers/${id_user}`, { headers });
      setSellers(sellers.filter((s) => s.id_user !== id_user));
    } catch {
      alert("Erreur lors de la suppression du vendeur.");
    }
  };

  // 🔍 Filtrage local
  const filteredSellers = sellers.filter(
    (s) =>
      (s.nom?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (s.prenom?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (s.email?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-smokeWhite font-outfit">
      <AdminSidebar />
     <main className="flex-1 ml-0 md:ml-64 p-6 md:p-8 w-full md:w-[calc(100%-16rem)] transition-all duration-300">
        <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-dropsDark mb-6 flex items-center gap-3">
          <FaStore className="text-dropsGreen" /> Gestion des vendeurs
        </h1>

        {/* 🔍 Barre de recherche */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex items-center gap-3">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un vendeur (nom, prénom, email)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full focus:outline-none"
          />
        </div>

        {loading ? (
          <p className="text-gray-500">Chargement des vendeurs...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow-md">
            <table className="min-w-full border-collapse">
              <thead className="bg-dropsGreen text-white">
                <tr>
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">Nom</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Statut</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSellers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      Aucun vendeur trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredSellers.map((s, i) => (
                    <tr key={s.id_user} className="border-b hover:bg-gray-50 transition">
                      <td className="py-3 px-4">{i + 1}</td>
                      <td className="py-3 px-4">
                        {s.nom} {s.prenom}
                      </td>
                      <td className="py-3 px-4">{s.email}</td>
                      <td className="py-3 px-4">
                        {s.active ? (
                          <span className="text-green-600 font-semibold">Actif</span>
                        ) : (
                          <span className="text-red-500 font-semibold">Inactif</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center flex justify-center gap-3">
                        <button
                          onClick={() => toggleActive(s.id_user, s.active)}
                          className={`px-3 py-2 rounded-lg text-white ${
                            s.active
                              ? "bg-amber-500 hover:bg-amber-600"
                              : "bg-green-500 hover:bg-green-600"
                          } transition`}
                        >
                          {s.active ? <FaToggleOff /> : <FaToggleOn />}
                        </button>
                        <button
                          onClick={() => handleDelete(s.id_user)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
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
