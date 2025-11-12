import { Link } from "react-router-dom";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { API_BASE_URL } from "./../config";

export default function ProductCard({ product }) {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`text-xs sm:text-sm ${
          i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-1 duration-300">
      {/* Image produit */}
      <div className="relative">
        <img
          src={
            product.image?.startsWith("http")
              ? product.image
              : `${API_BASE_URL}/uploads/${product.image}`
          }
          alt={product.nom}
          className="w-full h-52 sm:h-60 object-cover"
          onError={(e) => (e.target.src = "/default.jpg")}
        />

        {/* Badge */}
        <span className="absolute top-2 right-2 bg-dropsGreen text-white text-[10px] sm:text-xs px-2 py-1 rounded-full">
          Nouveau
        </span>
      </div>

      {/* Contenu */}
      <div className="p-3 sm:p-4">
        {/* Nom */}
        <h3 className="font-bold text-sm sm:text-base text-gray-800 line-clamp-1 mb-1">
          {product.nom}
        </h3>

        {/* Description courte */}
        <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 mb-3">
          {product.description || "Aucune description disponible."}
        </p>

        {/* Avis + note */}
        <div className="flex items-center gap-1 mb-2">
          {renderStars(product.note_moyenne || 5)}
          <span className="text-[11px] sm:text-xs text-gray-500 ml-1">
            ({product.nb_reviews || 0})
          </span>
        </div>

        {/* Prix + stock */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg sm:text-xl font-extrabold text-dropsGreen">
            {product.prix} €
          </span>
          <span className="text-[11px] sm:text-sm text-gray-500">
            {product.stock > 0 ? `${product.stock} en stock` : "Rupture"}
          </span>
        </div>

        {/* Bouton ajouter au panier */}
        <Link
          to="/login"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-dropsGreen to-dropsDark text-white py-1.5 sm:py-2 rounded-xl font-semibold text-xs sm:text-sm hover:shadow-lg transition"
        >
          <FaShoppingCart className="text-[10px] sm:text-sm" />
          Ajouter au panier
        </Link>
      </div>
    </div>
  );
}

