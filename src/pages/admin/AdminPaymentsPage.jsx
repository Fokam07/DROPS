import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMoneyCheckAlt, FaTrashAlt, FaSearch } from "react-icons/fa";
import AdminSidebar from "../../components/sidebar/AdminSidebar";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [filters, setFilters] = useState({ statut: "", mode: "" });
  const [search, setSearch] = useState(""); // 🔍 Barre de recherche
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchPayments = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/admin/payments", { headers });
      setPayments(res.data);
    } catch {
      setError("Erreur lors du chargement des paiements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id_payment) => {
    if (!window.confirm("Supprimer ce paiement ?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/payments/${id_payment}`, { headers });
      setPayments(payments.filter((p) => p.id_payment !== id_payment));
    } catch {
      alert("Erreur lors de la suppression.");
    }
  };

  // 🔍 Filtrage combiné (recherche + filtres)
  const filteredPayments = payments.filter(
    (p) =>
      (!filters.statut || p.statut === filters.statut) &&
      (!filters.mode || p.mode_paiement === filters.mode) &&
      ((p.user?.nom?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (p.user?.prenom?.toLowerCase() || "").includes(search.toLowerCase()))
  );

  return (
    <div className="flex min-h-screen bg-smokeWhite font-outfit">
      <AdminSidebar />
      <main className="flex-1 ml-0 md:ml-64 p-6 md:p-8 w-full md:w-[calc(100%-16rem)] transition-all duration-300">
        <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-dropsDark mb-6 flex items-center gap-3">
          <FaMoneyCheckAlt className="text-dropsGreen" /> Gestion des paiements
        </h1>

        {/* 🔍 Barre de filtres et recherche */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-4 items-center">
          <select
            value={filters.statut}
            onChange={(e) => setFilters({ ...filters, statut: e.target.value })}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="">Tous les statuts</option>
            <option value="EN_ATTENTE">En attente</option>
            <option value="SUCCES">Succès</option>
            <option value="ECHEC">Échec</option>
          </select>

          <select
            value={filters.mode}
            onChange={(e) => setFilters({ ...filters, mode: e.target.value })}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="">Tous les modes</option>
            <option value="CARTE">Carte</option>
            <option value="MOBILE_MONEY">Mobile Money</option>
            <option value="PAYPAL">PayPal</option>
          </select>

          {/* 🔍 Barre de recherche */}
          <div className="flex items-center bg-gray-50 border px-3 py-2 rounded-lg flex-grow">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent w-full focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Chargement des paiements...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow-md">
            <table className="min-w-full border-collapse">
              <thead className="bg-dropsGreen text-white">
                <tr>
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">Utilisateur</th>
                  <th className="py-3 px-4 text-left">Montant</th>
                  <th className="py-3 px-4 text-left">Mode</th>
                  <th className="py-3 px-4 text-left">Statut</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-500">
                      Aucun paiement trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((p, i) => (
                    <tr key={p.id_payment} className="border-b hover:bg-gray-50 transition">
                      <td className="py-3 px-4">{i + 1}</td>
                      <td className="py-3 px-4">
                        {p.user?.nom ? `${p.user.nom} ${p.user.prenom}` : "—"}
                      </td>
                      <td className="py-3 px-4 font-semibold text-dropsDark">
                        {p.montant ? `${p.montant} €` : "—"}
                      </td>
                      <td className="py-3 px-4">{p.mode_paiement || "—"}</td>
                      <td className="py-3 px-4 font-semibold">
                        {p.statut === "SUCCES" && <span className="text-green-600">Succès</span>}
                        {p.statut === "EN_ATTENTE" && (
                          <span className="text-yellow-500">En attente</span>
                        )}
                        {p.statut === "ECHEC" && <span className="text-red-500">Échec</span>}
                      </td>
                      <td className="py-3 px-4">
                        {new Date(p.date_paiement).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDelete(p.id_payment)}
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


