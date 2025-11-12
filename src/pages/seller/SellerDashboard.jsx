import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { FaBoxOpen, FaClipboardList, FaMoneyBillWave } from "react-icons/fa";
import SellerNavbar from "../../components/navbars/SellerNavbar";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SellerDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    totalRevenue: 0,
  });
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  // ✅ headers mémorisés pour éviter le warning useEffect
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prods, orders] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/sellers/products`, { headers }),
          axios.get(`${API_BASE_URL}/api/sellers/orders`, { headers }),
        ]);

        const totalRevenue = orders.data.reduce((sum, o) => sum + (o.total || 0), 0);

        // 🧾 Données simulées
        const fakeSales = [
          { month: "Jan", revenue: 220 },
          { month: "Fév", revenue: 480 },
          { month: "Mar", revenue: 350 },
          { month: "Avr", revenue: 600 },
          { month: "Mai", revenue: 420 },
          { month: "Juin", revenue: 800 },
        ];

        const categoriesCount = prods.data.reduce((acc, p) => {
          const cat = p.category_name || "Autre";
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
        }, {});

        const formattedCategories = Object.keys(categoriesCount).map((k) => ({
          name: k,
          value: categoriesCount[k],
        }));

        setStats({
          products: prods.data.length,
          orders: orders.data.length,
          totalRevenue,
        });
        setSalesData(fakeSales);
        setCategoryData(formattedCategories);
      } catch (e) {
        console.error("Erreur de chargement du tableau vendeur :", e);
      }
    };

    fetchStats();
  }, [headers]); // ✅ headers ajouté comme dépendance

  const COLORS = ["#22C55E", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];

  return (
    <div className="min-h-screen bg-smokeWhite font-outfit">
      <SellerNavbar sellerName={user.prenom || "Vendeur"} />

      <main className="pt-24 px-8">
        <h1 className="text-3xl font-bold text-dropsDark mb-8">
          Bonjour {user.prenom || "Vendeur"} 👋
        </h1>

        {/* 🧮 Statistiques rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard
            icon={<FaBoxOpen />}
            label="Mes produits"
            value={stats.products}
            color="bg-green-500"
          />
          <StatCard
            icon={<FaClipboardList />}
            label="Commandes reçues"
            value={stats.orders}
            color="bg-blue-500"
          />
          <StatCard
            icon={<FaMoneyBillWave />}
            label="Revenu total (€)"
            value={stats.totalRevenue.toFixed(2)}
            color="bg-yellow-500"
          />
        </div>

        {/* 📊 Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-12">
          {/* 📈 Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-dropsDark mb-4">
              Revenu mensuel (€)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#22C55E" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 🥧 Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-dropsDark mb-4">
              Répartition des produits par catégorie
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <p className="text-gray-600 mt-10">
          Bienvenue sur votre espace vendeur{" "}
          <span className="font-semibold text-dropsGreen">Drops</span>.  
          Gérez vos produits, suivez vos ventes et consultez vos commandes facilement.
        </p>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="flex items-center p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition">
      <div className={`${color} text-white p-4 rounded-lg text-3xl mr-4`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-600 text-sm">{label}</p>
        <h3 className="text-2xl font-bold text-dropsDark">{value}</h3>
      </div>
    </div>
  );
}
