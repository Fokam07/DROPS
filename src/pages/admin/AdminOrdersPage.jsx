import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaClipboardList, FaTrashAlt, FaSearch } from "react-icons/fa";
import AdminSidebar from "../../components/sidebar/AdminSidebar";


export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ statut: "", id_user: "" });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // ✅ URL de ton backend Render
  const BASE_URL = "https://drops-backend-nl6e.onrender.com/api/admin";

  const fetchAllData = async () => {
    try {
      const [ordersRes, usersRes] = await Promise.all([
        axios.get(`${BASE_URL}/orders`, { headers }),
        axios.get(`${BASE_URL}/users`, { headers }),
      ]);
      setOrders(ordersRes.data);
      setUsers(usersRes.data);
    } catch {
      setError("Erreur lors du chargement des commandes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.statut) params.append("statut", filters.statut);
      if (filters.id_user) params.append("id_user", filters.id_user);

      const res = await axios.get(`${BASE_URL}/orders/filter?${params.toString()}`, { headers });
      setOrders(res.data);
    } catch {
      alert("Erreur lors du filtrage des commandes.");
    }
  };

  const handleDelete = async (id_order) => {
    if (!window.confirm("Voulez-vous supprimer cette commande ?")) return;
    try {
      await axios.delete(`${BASE_URL}/orders/${id_order}`, { headers });
      setOrders(orders.filter((o) => o.id_order !== id_order));
    } catch {
      alert("Erreur lors de la suppression.");
    }
  };

  // 🔍 Filtrage combiné
  const filteredOrders = orders.filter(
    (order) =>
      (!filters.statut || order.statut === filters.statut) &&
      (!filters.id_user || order.user?.id_user === parseInt(filters.id_user)) &&
      ((order.user?.nom?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (order.user?.prenom?.toLowerCase() || "").includes(search.toLowerCase()))
  );

  return (
    <div className="flex min-h-screen bg-smokeWhite font-outfit">
      <AdminSidebar />
      <main className="flex-1 ml-0 md:ml-64 p-6 md:p-8 w-full md:w-[calc(100%-16rem)] transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-dropsDark mb-6 flex items-center gap-3">
            <FaClipboardList className="text-dropsGreen" /> Gestion des commandes
          </h1>

          {/* 🔍 Filtres + Recherche */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-4 items-center">
            <select
              value={filters.statut}
              onChange={(e) => setFilters({ ...filters, statut: e.target.value })}
              className="border px-3 py-2 rounded-lg"
            >
              <option value="">Tous les statuts</option>
              <option value="EN_ATTENTE">En attente</option>
              <option value="VALIDEE">Validée</option>
              <option value="ANNULEE">Annulée</option>
            </select>

            <select
              value={filters.id_user}
              onChange={(e) => setFilters({ ...filters, id_user: e.target.value })}
              className="border px-3 py-2 rounded-lg"
            >
              <option value="">Tous les utilisateurs</option>
              {users.map((u) => (
                <option key={u.id_user} value={u.id_user}>
                  {u.nom} {u.prenom}
                </option>
              ))}
            </select>

            <div className="flex items-center bg-gray-50 border px-3 py-2 rounded-lg flex-grow">
              <FaSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Rechercher une commande par nom ou prénom..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent w-full focus:outline-none"
              />
            </div>

            <button
              onClick={handleFilter}
              className="bg-dropsGreen text-white px-5 py-2 rounded-lg hover:bg-dropsDark transition flex items-center gap-2"
            >
              <FaSearch /> Filtrer
            </button>
          </div>

          {/* 📋 Tableau */}
          {loading ? (
            <p className="text-gray-500">Chargement des commandes...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="overflow-x-auto bg-white shadow-md rounded-xl">
              <table className="min-w-full border-collapse">
                <thead className="bg-dropsGreen text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">#</th>
                    <th className="py-3 px-4 text-left">Utilisateur</th>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Montant</th>
                    <th className="py-3 px-4 text-left">Statut</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-gray-500">
                        Aucune commande trouvée.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order, i) => (
                      <tr key={order.id_order} className="border-b hover:bg-gray-50 transition">
                        <td className="py-3 px-4">{i + 1}</td>
                        <td className="py-3 px-4">
                          {order.user ? `${order.user.nom} ${order.user.prenom}` : "—"}
                        </td>
                        <td className="py-3 px-4">
                          {new Date(order.date_creation).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="py-3 px-4 font-semibold text-dropsDark">
                          {order.total ? `${order.total} €` : "—"}
                        </td>
                        <td className="py-3 px-4 font-semibold">
                          {order.statut === "VALIDEE" && <span className="text-green-600">Validée</span>}
                          {order.statut === "EN_ATTENTE" && (
                            <span className="text-yellow-500">En attente</span>
                          )}
                          {order.statut === "ANNULEE" && (
                            <span className="text-red-500">Annulée</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleDelete(order.id_order)}
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



