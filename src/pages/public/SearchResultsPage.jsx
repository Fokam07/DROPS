import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../../components/ProductCard";
import { API_BASE_URL } from "../../config";

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = searchParams.get("query");

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/api/products/search?search=${encodeURIComponent(query)}`)
      .then((res) => setResults(res.data))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Résultats pour : <span className="text-dropsGreen">"{query}"</span>
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Recherche en cours...</p>
      ) : results.length === 0 ? (
        <p className="text-center text-gray-500">Aucun produit trouvé.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {results.map((p) => (
            <ProductCard key={p.id_product} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
