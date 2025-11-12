import React, { useEffect, useState } from "react";
import axios from "axios";
import UserSidebar from "../../components/sidebar/UserSidebar";
import { FaCommentDots, FaStar } from "react-icons/fa";
import { API_BASE_URL } from "../../config";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/reviews/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des avis :", err);
      }
    };
    fetchReviews();
  }, [token]);

  return (
    <div className="flex">
      <UserSidebar />
      <main className="flex-1 p-6 sm:p-8 w-full md:ml-64 mt-16 md:mt-0 flex justify-center">
  <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-dropsDark mb-6 flex items-center gap-2">
          <FaCommentDots className="text-dropsGreen" /> Mes avis
        </h1>

        {reviews.length === 0 ? (
          <div className="text-gray-600 text-center mt-20">
            Vous n’avez encore posté aucun avis 💭
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id_review}
                className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={review.product?.image || "https://via.placeholder.com/60"}
                    alt="Produit"
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <h3 className="font-semibold text-dropsDark">
                    {review.product?.nom}
                  </h3>
                </div>

                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`${
                        i < review.note ? "text-yellow-400" : "text-gray-300"
                      } text-lg`}
                    />
                  ))}
                </div>

                <p className="text-gray-600 italic">“{review.commentaire}”</p>
                <p className="text-right text-sm text-gray-400 mt-3">
                  {new Date(review.date_review).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
