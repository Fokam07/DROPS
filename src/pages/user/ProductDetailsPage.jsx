import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaShoppingCart, FaStar } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { API_BASE_URL } from "../../config";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null); // ⭐ avis de l’utilisateur
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newReview, setNewReview] = useState({ note: 5, commentaire: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ⭐ étoiles cliquables pour nouvelle note
  const renderStars = (rating, onClick) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        onClick={onClick ? () => onClick(i + 1) : undefined}
        className={`cursor-pointer text-xl ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  // 🌀 Charger produit + avis
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, reviewsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/products/${id}`),
          axios.get(`${API_BASE_URL}/api/reviews/product/${id}`),
        ]);

        const p = productRes.data;
        const r = reviewsRes.data;

        // ✅ Corriger l’URL image proprement
if (p.image) {
  let cleaned = p.image.replace(/\\/g, "/").replace("uploads/uploads/", "uploads/");

  if (cleaned.startsWith("http")) {
    p.image_url = cleaned;
  } else {
    // On s'assure qu'il n’y a qu’un seul "uploads/"
    cleaned = cleaned.replace(/^\/+/, ""); // supprime slashs début
    if (!cleaned.startsWith("uploads/")) {
      cleaned = `uploads/${cleaned}`;
    }
    p.image_url = `${API_BASE_URL}/${cleaned}`;
  }
}


        setProduct(p);
        setReviews(r.avis || []);

        // ✅ Vérifier si l'utilisateur a déjà laissé un avis
        if (token && user?.id_user) {
          const existing = (r.avis || []).find(
            (rev) => rev.auteur === user.id_user
          );
          if (existing) {
            setUserReview(existing);
            setNewReview({
              note: existing.note,
              commentaire: existing.commentaire,
            });
          }
        }
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les détails du produit.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token, user?.id_user]);

  // 🛒 Ajouter au panier
  const handleAddToCart = async () => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.post(
        `${API_BASE_URL}/cart/add/${product.id_product}`,
        { quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Produit ajouté au panier !");
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de l’ajout au panier.");
    }
  };

  // 💬 Soumettre ou mettre à jour un avis
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post(
        `${API_BASE_URL}/api/reviews/${id}`,
        newReview,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(
        userReview
          ? "✅ Votre avis a été mis à jour !"
          : "✅ Merci pour votre avis !"
      );

      setUserReview({ ...newReview, auteur: user.id_user });

      // 🔄 Recharger les avis
      const reviewsRes = await axios.get(
        `${API_BASE_URL}/api/reviews/product/${id}`
      );
      setReviews(reviewsRes.data.avis || []);
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de l’envoi de votre avis.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🕓 États de chargement / erreur
  if (loading)
    return <p className="text-center text-gray-500 mt-10">Chargement...</p>;
  if (error)
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!product) return null;

  return (
    <div className="min-h-screen bg-smokeWhite py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6 sm:p-10 flex flex-col lg:flex-row gap-8">
        {/* 🖼️ Image du produit */}
        <div className="flex-1 flex justify-center items-center">
          <img
            src={product.image_url || "https://via.placeholder.com/400x300"}
            alt={product.nom}
            className="w-full max-w-md h-72 sm:h-96 object-cover rounded-2xl shadow-md border border-gray-100"
          />
        </div>

        {/* 🧾 Détails */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-dropsDark mb-4 hover:text-dropsGreen transition"
            >
              <IoArrowBack className="mr-2" /> Retour
            </button>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-dropsDark mb-2">
              {product.nom}
            </h1>

            <div className="flex items-center mb-3">
              {renderStars(product.note_moyenne || 5)}
              <span className="text-gray-500 text-sm ml-2">
                ({product.nb_reviews || 0} avis)
              </span>
            </div>

            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-dropsGreen font-bold text-2xl mb-4">
              {product.prix} €
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Vendu par{" "}
              <span className="font-semibold">
                {product.vendeur_nom || "Entreprise non spécifiée"}
              </span>
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 ${
              product.stock > 0
                ? "bg-gradient-to-r from-dropsGreen to-dropsDark text-white hover:scale-105"
                : "bg-gray-300 text-white cursor-not-allowed"
            }`}
          >
            <FaShoppingCart /> Ajouter au panier
          </button>
        </div>
      </div>

      {/* 💬 Avis */}
      <div className="max-w-6xl mx-auto mt-10 bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold text-dropsDark mb-4">
          Avis des clients
        </h2>

        {Array.isArray(reviews) && reviews.length > 0 ? (
          <div className="space-y-4 mb-6">
            {reviews.map((r, i) => (
              <div key={i} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-dropsDark">
                    {r.user_name || "Utilisateur anonyme"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(r.date).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <div className="flex items-center mb-1">
                  {renderStars(r.note)}
                </div>
                <p className="text-gray-600 text-sm">{r.commentaire}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm mb-6">Aucun avis pour ce produit.</p>
        )}

        {token ? (
          <form
            onSubmit={handleSubmitReview}
            className="bg-gray-50 p-4 rounded-xl shadow-inner"
          >
            <h3 className="text-lg font-semibold mb-2">
              {userReview ? "Modifier votre avis" : "Laisser un avis"}
            </h3>

            <div className="flex items-center gap-2 mb-3">
              {renderStars(newReview.note, (val) =>
                setNewReview((prev) => ({ ...prev, note: val }))
              )}
            </div>

            <textarea
              value={newReview.commentaire}
              onChange={(e) =>
                setNewReview((prev) => ({
                  ...prev,
                  commentaire: e.target.value,
                }))
              }
              placeholder="Votre commentaire..."
              required
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-dropsGreen"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-3 bg-dropsGreen text-white font-semibold px-6 py-2 rounded-lg hover:bg-dropsDark transition disabled:opacity-50"
            >
              {isSubmitting
                ? "Envoi..."
                : userReview
                ? "Mettre à jour"
                : "Envoyer"}
            </button>
          </form>
        ) : (
          <p className="text-gray-500 text-sm">
            Connectez-vous pour laisser un avis.
          </p>
        )}
      </div>
    </div>
  );
}




