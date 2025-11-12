import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaTrashAlt, FaPlus, FaSearch } from "react-icons/fa";
import AdminSidebar from "../../components/sidebar/AdminSidebar";
import { API_BASE_URL } from "../../config";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState(""); // 🔍 Recherche
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    mot_de_passe: "",
    role: "CLIENT",
  });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://drops-backend-nl6e.onrender.com/api/admin/users", { headers });
      setUsers(res.data);
    } catch {
      setError("Erreur lors du chargement des utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id_user) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      await axios.delete(`https://drops-backend-nl6e.onrender.com/api/admin/users/{id_user}`, { headers });
      setUsers(users.filter((u) => u.id_user !== id_user));
    } catch {
      alert("Erreur lors de la suppression.");
    }
  };

  const resetForm = () => {
    setForm({ nom: "", prenom: "", email: "", mot_de_passe: "", role: "CLIENT" });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/users/admin/create`, form, { headers });
      resetForm();
      fetchUsers();
    } catch (err) {
      alert(err?.response?.data?.detail || "Erreur lors de la création de l'utilisateur.");
    }
  };

  // 🔍 Filtrage local
  const filteredUsers = users.filter(
    (u) =>
      (u.nom?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (u.prenom?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (u.email?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-smokeWhite font-outfit">
      <AdminSidebar />
      <main className="flex-1 ml-0 md:ml-64 p-6 md:p-8 w-full md:w-[calc(100%-16rem)] transition-all duration-300">
        <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-dropsDark mb-6 flex items-center gap-3">
          <FaUsers className="text-dropsGreen" /> Gestion des utilisateurs
        </h1>

        {/* ➕ Formulaire d'ajout */}
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-xl shadow-md p-5 mb-6 grid md:grid-cols-5 gap-4"
        >
          <input
            type="text"
            placeholder="Nom"
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            className="border rounded-lg px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Prénom"
            value={form.prenom}
            onChange={(e) => setForm({ ...form, prenom: e.target.value })}
            className="border rounded-lg px-3 py-2"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border rounded-lg px-3 py-2"
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={form.mot_de_passe}
            onChange={(e) => setForm({ ...form, mot_de_passe: e.target.value })}
            className="border rounded-lg px-3 py-2"
            required
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="border rounded-lg px-3 py-2"
          >
            <option value="CLIENT">CLIENT</option>
            <option value="VENDEUR">VENDEUR</option>
            <option value="ADMIN">ADMIN</option>
          </select>

          <div className="md:col-span-5 flex gap-3">
            <button
              type="submit"
              className="bg-dropsGreen text-white px-4 py-2 rounded-lg hover:bg-dropsDark transition flex items-center gap-2"
            >
              <FaPlus /> Ajouter l’utilisateur
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              Réinitialiser
            </button>
          </div>
        </form>

        {/* 🔍 Barre de recherche */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-4 flex items-center gap-3">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full focus:outline-none"
          />
        </div>

        {loading ? (
          <p className="text-gray-500">Chargement...</p>
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
                  <th className="py-3 px-4 text-left">Rôle</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u, i) => (
                    <tr key={u.id_user} className="border-b hover:bg-gray-50 transition">
                      <td className="py-3 px-4">{i + 1}</td>
                      <td className="py-3 px-4">
                        {u.nom} {u.prenom}
                      </td>
                      <td className="py-3 px-4">{u.email}</td>
                      <td className="py-3 px-4 font-semibold text-dropsDark">{u.role}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDelete(u.id_user)}
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

