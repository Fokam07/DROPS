import { Link } from "react-router-dom";
import {
  FaShoppingBag,
  FaTags,
  FaStore,
  FaUserShield,
  FaStar,
  FaArrowRight,
  FaFire,
} from "react-icons/fa";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { useState, useEffect } from "react";
import axios from "axios";
import HomeCarousel from "../../components/HomeCarousel";
import { API_BASE_URL } from "../../config";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/products`)
      .then((res) => {
        setProducts(res.data.slice(0, 8));
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="font-outfit bg-gradient-to-b from-white to-gray-50 text-dropsDark">
      {/* Carrousel Hero */}
      <HomeCarousel />

      {/* Section Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dropsGreen/10 via-white to-dropsDark/5 pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-dropsGreen/10 px-4 py-2 rounded-full mb-6">
            <FaFire className="text-dropsGreen" />
            <span className="text-sm font-semibold text-dropsGreen">
              Nouvelle plateforme e-commerce
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Bienvenue sur{" "}
            <span className="font-['Bebas_Neue'] text-transparent bg-clip-text bg-gradient-to-r from-dropsGreen to-dropsDark tracking-wider">
              DROPS
            </span>
          </h1>

          <p className="text-gray-600 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed px-4">
            La marketplace où particuliers et entreprises se retrouvent pour
            acheter, vendre et découvrir des produits exceptionnels du monde
            entier. 🌍
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 mb-12 px-4">
            <Link
              to="/register"
              className="group px-6 sm:px-8 py-4 bg-gradient-to-r from-dropsGreen to-dropsDark text-white rounded-full hover:shadow-2xl hover:scale-105 transition font-semibold text-base sm:text-lg flex items-center justify-center gap-2"
            >
              Rejoindre DROPS
              <FaArrowRight className="group-hover:translate-x-1 transition" />
            </Link>
            <Link
              to="/categories"
              className="px-6 sm:px-8 py-4 border-2 border-dropsGreen text-dropsGreen rounded-full hover:bg-dropsGreen hover:text-white transition font-semibold text-base sm:text-lg"
            >
              Explorer les catégories
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto px-4">
            <StatCard number="10K+" label="Produits" />
            <StatCard number="5K+" label="Vendeurs" />
            <StatCard number="50K+" label="Clients" />
          </div>
        </div>

        {/* Décorations */}
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-dropsGreen/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-dropsDark/5 rounded-full blur-3xl -z-10"></div>
      </section>

      {/* Section Produits Populaires */}
<section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
  <div className="text-center mb-8 sm:mb-12">
    <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
      Produits <span className="text-dropsGreen">Populaires</span> 🔥
    </h2>
    <p className="text-gray-600 text-base sm:text-lg px-4">
      Découvrez notre sélection des meilleurs produits du moment
    </p>
  </div>

  {loading ? (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-3 animate-pulse shadow-sm">
          <div className="bg-gray-200 h-36 sm:h-48 rounded-xl mb-3"></div>
          <div className="bg-gray-200 h-3 rounded mb-1"></div>
          <div className="bg-gray-200 h-3 rounded w-2/3"></div>
        </div>
      ))}
    </div>
  ) : (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
      {products.map((product) => (
        <ProductCard key={product.id_product} product={product} />
      ))}
    </div>
  )}

  <div className="text-center mt-8 sm:mt-12">
    <Link
      to="/products"
      className="inline-flex items-center gap-2 px-6 py-3 bg-dropsGreen text-white rounded-full hover:bg-dropsDark transition font-semibold text-sm sm:text-base"
    >
      Voir tous les produits
      <FaArrowRight />
    </Link>
  </div>
</section>

      {/* Services */}
      <section className="bg-white py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Pourquoi choisir{" "}
              <span className="font-['Bebas_Neue'] text-dropsGreen tracking-wider">
                DROPS
              </span>{" "}
              ?
            </h2>
            <p className="text-gray-600 text-base sm:text-lg px-4">
              Une expérience de shopping unique et sécurisée
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <ServiceCard
              icon={
                <FaShoppingBag className="text-dropsGreen text-4xl sm:text-5xl" />
              }
              title="Achat simplifié"
              text="Trouvez facilement les meilleurs produits à prix imbattables, en toute sécurité."
              gradient="from-blue-50 to-blue-100"
            />
            <ServiceCard
              icon={
                <FaTags className="text-dropsGreen text-4xl sm:text-5xl" />
              }
              title="Promotions exclusives"
              text="Bénéficiez d'offres limitées et de réductions sur vos marques préférées."
              gradient="from-purple-50 to-purple-100"
            />
            <ServiceCard
              icon={
                <FaStore className="text-dropsGreen text-4xl sm:text-5xl" />
              }
              title="Vendez facilement"
              text="Créez votre boutique en quelques clics et touchez des milliers de clients."
              gradient="from-green-50 to-green-100"
            />
          </div>
        </div>
      </section>

      {/* Sécurité */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dropsGreen via-dropsGreen to-dropsDark text-white py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
            <FaUserShield className="text-4xl sm:text-5xl" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6">
            Sécurité & Confiance avant tout
          </h2>
          <p className="text-lg sm:text-xl opacity-95 leading-relaxed mb-8">
            DROPS protège vos paiements, vos données et vos échanges avec les
            dernières technologies de cryptage. Achetez et vendez en toute
            tranquillité.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-8 text-sm">
            <span>Paiement sécurisé SSL</span>
            <span>Protection des données RGPD</span>
            <span>Support 24/7</span>
          </div>
        </div>
      </section>

      {/* Footer complet */}
      <footer className="bg-dropsDark text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-['Bebas_Neue'] text-2xl mb-4 flex items-center gap-2 tracking-wider">
                <RiShoppingBag3Fill className="text-dropsGreen text-3xl" />
                DROPS
              </h3>
              <p className="text-gray-400 text-sm">
                La marketplace qui connecte vendeurs et acheteurs du monde
                entier.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">À propos</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link
                    to="/about"
                    className="hover:text-dropsGreen transition"
                  >
                    Qui sommes-nous ?
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-dropsGreen transition">
                    Nos valeurs
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-dropsGreen transition">
                    Carrières
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link to="#" className="hover:text-dropsGreen transition">
                    Centre d'aide
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-dropsGreen transition">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-dropsGreen transition">
                    CGV
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suivez-nous</h4>
              <div className="flex gap-4">
                <button className="w-10 h-10 bg-white/10 rounded-full hover:bg-dropsGreen transition"></button>
                <button className="w-10 h-10 bg-white/10 rounded-full hover:bg-dropsGreen transition"></button>
                <button className="w-10 h-10 bg-white/10 rounded-full hover:bg-dropsGreen transition"></button>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} DROPS — Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}

/* --- Sous-composants --- */
function StatCard({ number, label }) {
  return (
    <div className="text-center">
      <div className="text-2xl sm:text-4xl font-extrabold text-dropsGreen mb-1">
        {number}
      </div>
      <div className="text-sm sm:text-base text-gray-600 font-medium">
        {label}
      </div>
    </div>
  );
}

function ServiceCard({ icon, title, text, gradient }) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-3xl p-6 sm:p-8 text-center hover:scale-105 hover:shadow-2xl transition duration-300`}
    >
      <div className="inline-flex items-center justify-center mb-4 sm:mb-6">
        {icon}
      </div>
      <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-800">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
        {text}
      </p>
    </div>
  );
}

function ProductCard({ product }) {
  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`text-[10px] sm:text-xs ${
          i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
      />
    ));

 const imageSrc = product.image_url;


  return (
    <Link
      to="/login"
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="relative overflow-hidden bg-gray-100 h-36 sm:h-48">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.nom}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            onError={(e) => (e.target.src = "/default.jpg")}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <FaShoppingBag className="text-4xl sm:text-5xl" />
          </div>
        )}
        <div className="absolute top-2 right-2 bg-dropsGreen text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full">
          Nouveau
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-sm sm:text-base mb-1 text-gray-800 line-clamp-1 group-hover:text-dropsGreen transition">
          {product.nom}
        </h3>

        <div className="flex items-center gap-0.5 mb-1 sm:mb-2">
          {renderStars(product.note_moyenne || 5)}
          <span className="text-[10px] sm:text-xs text-gray-500 ml-1">
            ({product.nb_reviews || 0})
          </span>
        </div>

        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-sm sm:text-lg font-extrabold text-dropsGreen">
            {product.prix}€
          </span>
          <span className="text-[10px] sm:text-xs text-gray-500">
            {product.stock > 0 ? `${product.stock} en stock` : "Rupture"}
          </span>
        </div>

        <button className="w-full bg-gradient-to-r from-dropsGreen to-dropsDark text-white py-1.5 sm:py-2 rounded-lg font-semibold text-[11px] sm:text-sm hover:shadow-lg transition">
          Voir le produit
        </button>
      </div>
    </Link>
  );
}




