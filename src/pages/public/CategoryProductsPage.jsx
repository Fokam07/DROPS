import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaStar, FaShoppingBag } from "react-icons/fa";

export default function CategoryProductsPage() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/products/public/category/${id}`)
      .then((res) => {
        setProducts(res.data);
        if (res.data.length > 0) setCategoryName(res.data[0].category?.nom || "Catégorie");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="text-center mt-40 text-gray-500">
        Chargement des produits...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-dropsGreen mb-10 text-center">
        Produits — {categoryName}
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">Aucun produit trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id_product}
              to="/login"
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300"
            >
              <div className="relative overflow-hidden bg-gray-100 h-48 sm:h-56">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.nom}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FaShoppingBag className="text-5xl sm:text-6xl" />
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-5">
                <h3 className="font-bold text-base sm:text-lg mb-2 text-gray-800 line-clamp-1 group-hover:text-dropsGreen transition">
                  {product.nom}
                </h3>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-sm ${
                        i < Math.floor(product.note_moyenne || 5)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">
                    ({product.nb_reviews || 0})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-extrabold text-dropsGreen">
                    {product.prix} €
                  </span>
                  <span className="text-xs text-gray-500">
                    {product.stock > 0 ? `${product.stock} en stock` : "Rupture"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
