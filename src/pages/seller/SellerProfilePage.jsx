import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { FaUserCircle, FaLock, FaSave } from "react-icons/fa";
import SellerNavbar from "../../components/navbars/SellerNavbar";

export default function SellerProfilePage() {
  const [seller, setSeller] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // Charger les infos vendeur
  const fetchSeller = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/sellers/me`, { headers });
      setSeller(res.data);
    } catch (err) {
      console.error("Erreur chargement profil vendeur :", err);
      setMessage({ type: "error", text: "Impossible de charger les informations du profil." });
    }
  };

  useEffect(() => {
    fetchSeller();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/users/${seller.id_user}`,
        {
          nom: seller.nom,
          prenom: seller.prenom,
          email: seller.email,
        },
        { headers }
      );
      setEditMode(false);
      setMessage({ type: "success", text: "Profil mis à jour avec succès ✅" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Erreur lors de la mise à jour du profil." });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/auth/change-password`, passwordForm, { headers });
      setPasswordForm({ old_password: "", new_password: "" });
      setMessage({ type: "success", text: "Mot de passe changé avec succès 🔒" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Ancien mot de passe incorrect." });
    }
  };

  return (
    <div className="min-h-screen bg-smokeWhite font-outfit">
      <SellerNavbar sellerName={seller.prenom || "Vendeur"} />

      <main className="pt-24 px-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-dropsDark mb-8 flex items-center gap-3">
          <FaUserCircle className="text-dropsGreen" /> Mon profil vendeur
        </h1>

        {/* 🟢 Messages globaux */}
        {message.text && (
          <div
            className={`p-3 rounded mb-4 ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* 👤 Informations personnelles */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold text-dropsDark mb-4">
            Informations personnelles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Nom"
              value={seller.nom || ""}
              editable={editMode}
              onChange={(v) => setSeller({ ...seller, nom: v })}
            />
            <FormField
              label="Prénom"
              value={seller.prenom || ""}
              editable={editMode}
              onChange={(v) => setSeller({ ...seller, prenom: v })}
            />
            <FormField
              label="Email"
              value={seller.email || ""}
              editable={editMode}
              onChange={(v) => setSeller({ ...seller, email: v })}
              type="email"
            />
            <FormField
              label="Date d’inscription"
              value={
                seller.date_creation
                  ? new Date(seller.date_creation).toLocaleDateString("fr-FR")
                  : ""
              }
              editable={false}
            />
          </div>

          <div className="mt-6 flex gap-3">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-dropsGreen text-white px-5 py-2 rounded-lg hover:bg-dropsDark transition flex items-center gap-2"
                >
                  <FaSave /> Enregistrer
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-300 px-5 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Annuler
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="bg-dropsGreen text-white px-5 py-2 rounded-lg hover:bg-dropsDark transition"
              >
                Modifier
              </button>
            )}
          </div>
        </div>

        {/* 🔒 Changement de mot de passe */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-dropsDark mb-4 flex items-center gap-2">
            <FaLock /> Changer mon mot de passe
          </h2>

          <form
            onSubmit={handlePasswordChange}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="password"
              placeholder="Ancien mot de passe"
              value={passwordForm.old_password}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, old_password: e.target.value })
              }
              required
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              value={passwordForm.new_password}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, new_password: e.target.value })
              }
              required
              className="border rounded-lg px-3 py-2"
            />
            <button
              type="submit"
              className="col-span-2 bg-dropsGreen text-white px-5 py-2 rounded-lg hover:bg-dropsDark transition flex items-center justify-center gap-2"
            >
              <FaSave /> Mettre à jour le mot de passe
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

// 🧩 Sous-composant : champ de formulaire réutilisable
function FormField({ label, value, editable, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-gray-600 text-sm">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => editable && onChange?.(e.target.value)}
        disabled={!editable}
        className={`w-full border rounded-lg px-3 py-2 mt-1 ${
          !editable && "bg-gray-100 cursor-not-allowed"
        }`}
      />
    </div>
  );
}

