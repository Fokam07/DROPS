import React, { useEffect, useState } from "react";
import axios from "axios";
import UserSidebar from "../../components/sidebar/UserSidebar";
import { FaClipboardList } from "react-icons/fa";
import { API_BASE_URL } from "../../config";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des commandes :", err);
      }
    };
    fetchOrders();
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case "EN_ATTENTE":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "EXPEDIEE":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "LIVREE":
        return "bg-green-100 text-green-700 border-green-300";
      case "ANNULEE":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="flex">
      <UserSidebar />

      <main className="flex-1 p-6 sm:p-8 w-full md:ml-64 mt-16 md:mt-0 flex justify-center">
  <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-dropsDark mb-6 flex items-center gap-2">
          <FaClipboardList className="text-dropsGreen" /> Mes commandes
        </h1>

        {orders.length === 0 ? (
          <div className="text-gray-600 text-center mt-20">
            Vous n’avez encore passé aucune commande 📦
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-dropsGreen text-white">
                <tr>
                  <th className="p-3">Référence</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Montant total</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id_order}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-semibold text-dropsDark">
                      #{order.id_order}
                    </td>
                    <td className="p-3 text-gray-600">
                      {new Date(order.date_order).toLocaleDateString()}
                    </td>
                    <td className="p-3 font-semibold text-dropsGreen">
                      {order.total.toFixed(2)} €
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button className="text-dropsGreen hover:text-dropsDark font-medium">
                        Voir détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
