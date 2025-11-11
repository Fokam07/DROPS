import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTags, FaPlus, FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import AdminSidebar from "../../components/sidebar/AdminSidebar";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ nom: "", description: "", image: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/admin/categories", { headers });
      setCategories(res.data);
    } catch {
      setErr("Erreur lors du chargement des catégories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setForm({ nom: "", description: "", image: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId)
        await axios.put(`http://localhost:8000/api/admin/categories/${editingId}`, form, { headers });
      else await axios.post("http://localhost:8000/api/admin/categories", form, { headers });
      resetForm();
      fetchCategories();
    } catch {
      alert("Erreur lors de l'enregistrement de la catégorie.");
    }
  };

  const handleDelete = async (id_category) => {
    if (!window.confirm("Supprimer cette catégorie ?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/categories/${id_category}`, { headers });
      setCategories(categories.filter((c) => c.id_category !== id_category));
    } catch {
      alert("Erreur lors de la suppression.");
    }
  };

  const filtered = categories.filter((c) =>
    (c.nom || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-smokeWhite font-outfit">
      <AdminSidebar />
      <main className="flex-1 ml-0 md:ml-64 p-6 md:p-8 w-full md:w-[calc(100%-16rem)] transition-all duration-300">
        <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-dropsDark mb-6 flex items-center gap-3">
          <FaTags className="text-dropsGreen" /> Gestion des catégories
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-5 rounded-xl shadow-md mb-6 grid md:grid-cols-4 gap-4"
        >
          <input
            type="text"
            placeholder="Nom de la catégorie"
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            className="border rounded-lg px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border rounded-lg px-3 py-2"
          />
          <input
            type="text"
            placeholder="URL image"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="border rounded-lg px-3 py-2"
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-dropsGreen text-white rounded-lg px-4 py-2 hover:bg-dropsDark transition flex items-center justify-center gap-2"
            >
              {editingId ? (
                <>
                  <FaEdit /> Mettre à jour
                </>
              ) : (
                <>
                  <FaPlus /> Ajouter
                </>
              )}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition"
              >
                Annuler
              </button>
            )}
          </div>
        </form>

        <div className="bg-white p-4 rounded-xl shadow-md mb-4 flex items-center gap-3">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une catégorie…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full focus:outline-none"
          />
        </div>

        {loading ? (
          <p className="text-gray-500">Chargement…</p>
        ) : err ? (
          <p className="text-red-500">{err}</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-xl">
            <table className="min-w-full border-collapse">
              <thead className="bg-dropsGreen text-white">
                <tr>
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">Nom</th>
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-left">Image</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-gray-500">
                      Aucune catégorie trouvée.
                    </td>
                  </tr>
                ) : (
                  filtered.map((c, i) => (
                    <tr key={c.id_category} className="border-b hover:bg-gray-50 transition">
                      <td className="py-3 px-4">{i + 1}</td>
                      <td className="py-3 px-4 font-semibold">{c.nom}</td>
                      <td className="py-3 px-4">{c.description || "—"}</td>
                      <td className="py-3 px-4">
                        {c.image ? (
                          <img src={c.image} alt={c.nom} className="h-10 rounded-lg object-cover" />
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-3 px-4 text-center flex justify-center gap-3">
                        <button
                          onClick={() => {
                            setEditingId(c.id_category);
                            setForm({
                              nom: c.nom || "",
                              description: c.description || "",
                              image: c.image || "",
                            });
                          }}
                          className="px-3 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id_category)}
                          className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                        >
                          <FaTrash />
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

