import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaClipboardList, FaSearch, FaUser, FaMoneyBillWave } from "react-icons/fa";
import SellerNavbar from "../../components/navbars/SellerNavbar";

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/sellers/orders", { headers });
      setOrders(res.data);
    } catch (err) {
      console.error("Erreur chargement commandes :", err);
      setError("Erreur lors du chargement des commandes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredOrders = orders.filter(
    (o) =>
      (o.id_order && String(o.id_order).includes(search)) ||
      (o.user?.nom || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.user?.prenom || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-smokeWhite font-outfit">
      <SellerNavbar sellerName={user.prenom || "Vendeur"} />

      <main className="pt-24 px-8">
        <h1 className="text-3xl font-bold text-dropsDark mb-8 flex items-center gap-3">
          <FaClipboardList className="text-dropsGreen" /> Commandes reçues
        </h1>

        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex items-center gap-3">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par client ou n° commande..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-none focus:outline-none"
          />
        </div>

        {loading ? (
          <p className="text-gray-500">Chargement des commandes...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            Aucune commande trouvée pour vos produits.
          </p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow-md">
            <table className="min-w-full border-collapse">
              <thead className="bg-dropsGreen text-white">
                <tr>
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">Client</th>
                  <th className="py-3 px-4 text-left">Produits</th>
                  <th className="py-3 px-4 text-left">Total (€)</th>
                  <th className="py-3 px-4 text-left">Statut</th>
                  <th className="py-3 px-4 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, i) => (
                  <tr key={order.id_order} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-semibold">{i + 1}</td>
                    <td className="py-3 px-4 flex items-center gap-2">
                      <FaUser className="text-gray-400" />
                      {order.user
                        ? `${order.user.prenom} ${order.user.nom}`
                        : `Utilisateur #${order.id_user}`}
                    </td>
                    <td className="py-3 px-4">
                      {order.items && order.items.length > 0 ? (
                        <ul className="text-sm text-gray-600 list-disc list-inside">
                          {order.items.map((it, idx) => (
                            <li key={idx}>
                              {it.product?.nom || "Produit"} × {it.quantite}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span>—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 flex items-center gap-1">
                      <FaMoneyBillWave className="text-green-500" />
                      {order.total ? order.total.toFixed(2) : "0.00"}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={order.statut} />
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(order.date_commande).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    EN_ATTENTE: "bg-yellow-100 text-yellow-700",
    EN_COURS: "bg-blue-100 text-blue-700",
    LIVREE: "bg-green-100 text-green-700",
    ANNULEE: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${
        colors[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status || "Inconnu"}
    </span>
  );
}

