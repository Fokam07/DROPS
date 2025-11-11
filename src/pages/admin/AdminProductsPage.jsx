import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBoxOpen, FaPlus, FaTrashAlt, FaSearch } from "react-icons/fa";
import AdminSidebar from "../../components/sidebar/AdminSidebar";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [search, setSearch] = useState(""); // 🔍 Nouveau state de recherche
  const [form, setForm] = useState({
    nom: "",
    description: "",
    prix: "",
    stock: "",
    id_category: "",
    id_seller: "",
    image_file: null,
    image_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAllData = async () => {
    try {
      const [prodRes, catRes, sellRes] = await Promise.all([
        axios.get("http://localhost:8000/api/admin/products", { headers }),
        axios.get("http://localhost:8000/api/admin/categories", { headers }),
        axios.get("http://localhost:8000/api/admin/sellers", { headers }),
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
      setSellers(sellRes.data);
    } catch {
      setError("Erreur lors du chargement des produits.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setForm({
      nom: "",
      description: "",
      prix: "",
      stock: "",
      id_category: "",
      id_seller: "",
      image_file: null,
      image_url: "",
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("nom", form.nom);
      formData.append("prix", form.prix);
      formData.append("description", form.description);
      formData.append("stock", form.stock);
      formData.append("id_category", form.id_category);
      if (form.id_seller) formData.append("id_seller", form.id_seller);
      if (form.image_file) formData.append("image_file", form.image_file);
      if (form.image_url) formData.append("image_url", form.image_url);

      await axios.post("http://localhost:8000/api/admin/products", formData, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });

      resetForm();
      fetchAllData();
      alert("✅ Produit ajouté avec succès !");
    } catch (err) {
      alert(err?.response?.data?.detail || "Erreur lors de la création du produit.");
    }
  };

  const handleDelete = async (id_product) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/products/${id_product}`, { headers });
      setProducts(products.filter((p) => p.id_product !== id_product));
    } catch {
      alert("Erreur lors de la suppression du produit.");
    }
  };

  // 🔍 Filtrage dynamique
  const filteredProducts = products.filter((p) =>
    (p.nom || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-smokeWhite font-outfit">
      <AdminSidebar />
      <main className="flex-1 ml-0 md:ml-64 p-6 md:p-8 w-full md:w-[calc(100%-16rem)] transition-all duration-300">
        <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-dropsDark mb-6 flex items-center gap-3">
          <FaBoxOpen className="text-dropsGreen" /> Gestion des produits
        </h1>

        {/* ➕ Formulaire d’ajout produit */}
        <form
          onSubmit={handleCreate}
          className="bg-white p-5 rounded-xl shadow-md mb-8 grid lg:grid-cols-3 gap-4"
        >
          <input
            type="text"
            placeholder="Nom du produit"
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            className="border rounded-lg px-3 py-2"
            required
          />
          <input
            type="number"
            placeholder="Prix (€)"
            value={form.prix}
            onChange={(e) => setForm({ ...form, prix: e.target.value })}
            className="border rounded-lg px-3 py-2"
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="border rounded-lg px-3 py-2"
          />
          <select
            value={form.id_category}
            onChange={(e) => setForm({ ...form, id_category: e.target.value })}
            className="border rounded-lg px-3 py-2"
            required
          >
            <option value="">Catégorie</option>
            {categories.map((cat) => (
              <option key={cat.id_category} value={cat.id_category}>
                {cat.nom}
              </option>
            ))}
          </select>
          <select
            value={form.id_seller}
            onChange={(e) => setForm({ ...form, id_seller: e.target.value })}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">Vendeur (optionnel)</option>
            {sellers.map((s) => (
              <option key={s.id_user} value={s.id_user}>
                {s.nom} {s.prenom}
              </option>
            ))}
          </select>

          {/* Image : Upload ou URL */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600">Image (upload ou lien)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, image_file: e.target.files[0] })}
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="text"
              placeholder="Ou coller une URL d’image"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
          </div>

          <div className="lg:col-span-3 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-dropsGreen text-white px-5 py-2 rounded-lg hover:bg-dropsDark transition"
            >
              <FaPlus /> Ajouter le produit
            </button>
          </div>
        </form>

        {/* 🔍 Barre de recherche (comme dans Categories) */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-4 flex items-center gap-3">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un produit…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full focus:outline-none"
          />
        </div>

        {/* 📋 Liste produits */}
        {loading ? (
          <p className="text-gray-500">Chargement des produits...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-xl">
            <table className="min-w-full border-collapse">
              <thead className="bg-dropsGreen text-white">
                <tr>
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">Nom</th>
                  <th className="py-3 px-4 text-left">Catégorie</th>
                  <th className="py-3 px-4 text-left">Vendeur</th>
                  <th className="py-3 px-4 text-left">Prix</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      Aucun produit trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p, i) => (
                    <tr key={p.id_product} className="border-b hover:bg-gray-50 transition">
                      <td className="py-3 px-4">{i + 1}</td>
                      <td className="py-3 px-4 font-semibold">{p.nom}</td>
                      <td className="py-3 px-4">{p.category?.nom || "—"}</td>
                      <td className="py-3 px-4">
                        {p.seller?.nom ? `${p.seller.nom} ${p.seller.prenom}` : "—"}
                      </td>
                      <td className="py-3 px-4">{p.prix} €</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDelete(p.id_product)}
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



