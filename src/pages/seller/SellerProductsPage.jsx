import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBoxOpen, FaPlus, FaEdit, FaTrash, FaImage } from "react-icons/fa";
import SellerNavbar from "../../components/navbars/SellerNavbar";

export default function SellerProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    nom: "",
    description: "",
    prix: "",
    stock: "",
    id_category: "",
    image_file: null,
    image_url: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // ======================
  // 🔄 Chargement données
  // ======================
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/sellers/products", { headers });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/categories", { headers });
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ======================
  // 🧹 Reset Form
  // ======================
  const resetForm = () => {
    setForm({
      nom: "",
      description: "",
      prix: "",
      stock: "",
      id_category: "",
      image_file: null,
      image_url: "",
    });
    setPreview(null);
    setEditingId(null);
  };

  // ======================
  // 💾 Création / Édition
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("nom", form.nom);
      formData.append("description", form.description);
      formData.append("prix", form.prix);
      formData.append("stock", form.stock);
      formData.append("id_category", form.id_category);
      if (form.image_file) formData.append("image_file", form.image_file);
      if (form.image_url) formData.append("image_url", form.image_url);

      if (editingId) {
        await axios.put(`http://localhost:8000/api/sellers/products/${editingId}`, formData, {
          headers: { ...headers, "Content-Type": "multipart/form-data" },
        });
        alert("✅ Produit mis à jour !");
      } else {
        await axios.post("http://localhost:8000/api/sellers/products", formData, {
          headers: { ...headers, "Content-Type": "multipart/form-data" },
        });
        alert("✅ Produit ajouté avec succès !");
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de l’enregistrement du produit.");
    }
  };

  // ======================
  // ✏️ Édition
  // ======================
  const handleEdit = (p) => {
    setEditingId(p.id_product);
    setForm({
      nom: p.nom,
      description: p.description || "",
      prix: p.prix,
      stock: p.stock,
      id_category: p.id_category || "",
      image_file: null,
      image_url: "",
    });
    setPreview(p.image || null);
  };

  // ======================
  // 🗑️ Suppression
  // ======================
  const handleDelete = async (id_product) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/sellers/products/${id_product}`, { headers });
      setProducts(products.filter((p) => p.id_product !== id_product));
    } catch {
      alert("Erreur lors de la suppression du produit.");
    }
  };

  // ======================
  // 👀 Aperçu image
  // ======================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image_file: file, image_url: "" });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setForm({ ...form, image_url: url, image_file: null });
    setPreview(url || null);
  };

  return (
    <div className="min-h-screen bg-smokeWhite font-outfit">
      <SellerNavbar sellerName={user.prenom || "Vendeur"} />
      <main className="pt-24 px-8">
        <h1 className="text-3xl font-bold text-dropsDark mb-8 flex items-center gap-3">
          <FaBoxOpen className="text-dropsGreen" /> Gestion de mes produits
        </h1>

        {/* 🧾 Formulaire produit */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-5 rounded-xl shadow-md mb-8 grid md:grid-cols-3 gap-4"
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

          {/* 📝 Description */}
          <textarea
            placeholder="Description du produit"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border rounded-lg px-3 py-2 md:col-span-3 h-24 resize-none"
            required
          />

          <select
            value={form.id_category}
            onChange={(e) => setForm({ ...form, id_category: e.target.value })}
            className="border rounded-lg px-3 py-2"
            required
          >
            <option value="">Catégorie</option>
            {categories.map((c) => (
              <option key={c.id_category} value={c.id_category}>
                {c.nom}
              </option>
            ))}
          </select>

          {/* 📸 Image : upload ou lien */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm text-gray-600">Image (upload ou lien)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="text"
              placeholder="Ou coller une URL d’image"
              value={form.image_url}
              onChange={handleUrlChange}
              className="border rounded-lg px-3 py-2"
            />

            {preview && (
              <img
                src={preview}
                alt="Aperçu"
                className="h-24 w-24 rounded-lg object-cover mt-2 border"
              />
            )}
          </div>

          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-dropsGreen text-white px-5 py-2 rounded-lg hover:bg-dropsDark transition"
            >
              {editingId ? (
                <>
                  <FaEdit /> Modifier
                </>
              ) : (
                <>
                  <FaPlus /> Ajouter le produit
                </>
              )}
            </button>
          </div>
        </form>

        {/* 📋 Liste produits */}
        <div className="overflow-x-auto bg-white shadow-md rounded-xl">
          <table className="min-w-full border-collapse">
            <thead className="bg-dropsGreen text-white">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Nom</th>
                <th className="py-3 px-4">Prix</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Catégorie</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.id_product} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-4">{i + 1}</td>
                  <td className="py-3 px-4">
                    {p.image ? (
                      <img src={p.image} alt={p.nom} className="h-10 w-10 rounded-lg object-cover" />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-3 px-4 font-semibold text-dropsDark">{p.nom}</td>
                  <td className="py-3 px-4">{p.prix} €</td>
                  <td className="py-3 px-4">{p.stock}</td>
                  <td className="py-3 px-4">
                    {categories.find((c) => c.id_category === p.id_category)?.nom || "—"}
                  </td>
                  <td className="py-3 px-4 text-center flex gap-3 justify-center">
                    <button
                      onClick={() => handleEdit(p)}
                      className="px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id_product)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
