import { useEffect, useState } from "react";
import axios from "axios";

export default function useCartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setCount(0);
          return;
        }

        const res = await axios.get("http://localhost:8000/api/cart/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Compter le nombre total d’articles (somme des quantités)
        const totalItems = res.data.items?.reduce(
          (acc, item) => acc + item.quantite,
          0
        ) || 0;

        setCount(totalItems);
      } catch (err) {
        console.error("Erreur lors du chargement du panier :", err);
        setCount(0);
      }
    };

    fetchCartCount();

    // 🔁 rafraîchit toutes les 10 secondes
    const interval = setInterval(fetchCartCount, 10000);
    return () => clearInterval(interval);
  }, []);

  return count;
}
