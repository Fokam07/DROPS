import React, { useState, useEffect } from "react";
import axios from "axios";
import UserSidebar from "../../components/sidebar/UserSidebar";
import { FaCog, FaSave } from "react-icons/fa";

export default function SettingsPage() {
  const [form, setForm] = useState({ prenom: "", nom: "", email: "" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setForm(JSON.parse(storedUser));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("http://localhost:8000/api/users/me", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.setItem("user", JSON.stringify(res.data));
      alert("✅ Profil mis à jour avec succès !");
    } catch (err) {
      alert("❌ Erreur lors de la mise à jour du profil.");
      console.error(err);
    }
  };

  return (
    <div className="flex">
      <UserSidebar />
      <main className="flex-1 p-6 sm:p-8 w-full md:ml-64 mt-16 md:mt-0 flex justify-center">
  <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-dropsDark mb-6 flex items-center gap-2">
          <FaCog className="text-dropsGreen" /> Paramètres du profil
        </h1>

        <form
          onSubmit={handleSave}
          className="bg-white shadow-md rounded-lg p-6 max-w-lg space-y-5"
        >
          <div>
            <label className="block text-gray-600 mb-1">Prénom</label>
            <input
              type="text"
              name="prenom"
              value={form.prenom}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dropsGreen"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Nom</label>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dropsGreen"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dropsGreen"
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 bg-dropsGreen text-white px-5 py-2 rounded-lg hover:bg-dropsDark transition"
          >
            <FaSave /> Enregistrer
          </button>
        </form>
        </div>
      </main>
    </div>
  );
}
