import React, { useState } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaStar, FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    mot_de_passe: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await axios.post("http://localhost:8000/api/users/register", formData);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError("Erreur lors de l'inscription. Vérifiez vos informations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dropsDark/5 via-white to-dropsGreen/10 font-outfit flex items-center justify-center p-4">
      {/* Retour à l'accueil */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-dropsGreen transition group"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition" />
        <span className="font-medium">Retour</span>
      </Link>

      <div className="w-full max-w-md">
        {/* Logo + Titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <FaStar className="text-dropsGreen text-4xl drop-shadow-lg" />
            <h1 className="text-4xl font-extrabold text-dropsDark">Drops</h1>
          </div>
          <p className="text-gray-600">Créez votre compte gratuitement</p>
        </div>

        {/* Carte d'inscription */}
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-xl mb-6 text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-xl mb-6 text-center">
              🎉 Inscription réussie ! Redirection...
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Nom */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nom
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-dropsGreen focus:ring-4 focus:ring-dropsGreen/10 outline-none transition"
                />
              </div>
            </div>

            {/* Prénom */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Prénom
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  placeholder="John"
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-dropsGreen focus:ring-4 focus:ring-dropsGreen/10 outline-none transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@email.com"
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-dropsGreen focus:ring-4 focus:ring-dropsGreen/10 outline-none transition"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="mot_de_passe"
                  value={formData.mot_de_passe}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-dropsGreen focus:ring-4 focus:ring-dropsGreen/10 outline-none transition"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Minimum 8 caractères recommandés
              </p>
            </div>

            {/* Bouton d'inscription */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-dropsGreen to-dropsDark text-white py-3.5 rounded-xl hover:shadow-lg hover:scale-[1.02] transition font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Création du compte...
                </span>
              ) : (
                "Créer mon compte"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-500 font-medium">OU</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Lien connexion */}
          <p className="text-center text-gray-600">
            Déjà un compte ?{" "}
            <Link
              to="/login"
              className="text-dropsGreen font-semibold hover:underline"
            >
              Connectez-vous
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          En créant un compte, vous acceptez nos{" "}
          <button className="underline hover:text-dropsGreen">
            Conditions d'utilisation
          </button>
        </p>
      </div>
    </div>
  );
}
