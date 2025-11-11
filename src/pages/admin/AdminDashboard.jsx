import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  FaUsers,
  FaBoxOpen,
  FaShoppingBag,
  FaMoneyBillWave,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import AdminSidebar from "../../components/sidebar/AdminSidebar";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/admin/dashboard", { headers });
        setStats(res.data);
      } catch (err) {
        console.error("Erreur chargement statistiques :", err);
        setError("Impossible de charger les statistiques.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [headers]);

  const COLORS = ["#22C55E", "#EAB308", "#EF4444", "#3B82F6", "#9333EA"];

  const pieData = useMemo(
    () =>
      stats
        ? [
            { name: "Clients", value: stats.utilisateurs.clients || 0 },
            { name: "Vendeurs", value: stats.utilisateurs.vendeurs || 0 },
            { name: "Admin", value: stats.utilisateurs.total - (stats.utilisateurs.clients + stats.utilisateurs.vendeurs) },
          ]
        : [],
    [stats]
  );

  const barData = useMemo(
    () =>
      stats
        ? Object.entries(stats.commandes.par_statut || {}).map(([key, value]) => ({
            statut:
              key === "VALIDEE"
                ? "Validées"
                : key === "EN_ATTENTE"
                ? "En attente"
                : "Annulées",
            total: value,
          }))
        : [],
    [stats]
  );

  return (
    <div className="flex min-h-screen bg-smokeWhite font-outfit">
      <AdminSidebar />

      {/* ✅ Responsive layout : marge seulement sur desktop */}
      <main className="flex-1 ml-0 md:ml-64 p-6 md:p-8 w-full md:w-[calc(100%-16rem)] transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-dropsDark mb-8 text-center md:text-left">
            Tableau de bord Administrateur
          </h1>

          {loading ? (
            <p className="text-gray-500 text-center">Chargement des statistiques...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            stats && (
              <>
                {/* 🔹 Cartes principales */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  <StatCard icon={<FaUsers />} label="Utilisateurs" value={stats.utilisateurs.total} color="bg-blue-500" />
                  <StatCard icon={<FaBoxOpen />} label="Produits" value={stats.produits.total} color="bg-green-500" />
                  <StatCard icon={<FaShoppingBag />} label="Commandes" value={stats.commandes.total} color="bg-yellow-500" />
                  <StatCard
                    icon={<FaMoneyBillWave />}
                    label="Revenus (€)"
                    value={stats.paiements.revenus_totaux.toLocaleString("fr-FR")}
                    color="bg-purple-500"
                  />
                </div>

                {/* 🔹 Graphiques */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* 🎯 Diagramme circulaire */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold text-dropsDark mb-4 text-center md:text-left">
                      Répartition des utilisateurs
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={({ name, value }) => `${name} (${value})`}
                          dataKey="value"
                        >
                          {pieData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* 📊 Diagramme en barres */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold text-dropsDark mb-4 text-center md:text-left">
                      Commandes par statut
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="statut" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="total" fill="#22C55E" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )
          )}
        </div>
      </main>
    </div>
  );
}

// 🔹 Carte statistique
function StatCard({ icon, label, value, color }) {
  return (
    <div className="flex items-center bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
      <div className={`${color} text-white p-4 rounded-lg text-3xl mr-4`}>{icon}</div>
      <div>
        <p className="text-gray-600 text-sm">{label}</p>
        <h3 className="text-2xl font-bold text-dropsDark">{value}</h3>
      </div>
    </div>
  );
}
