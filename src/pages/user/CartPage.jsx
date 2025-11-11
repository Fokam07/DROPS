import React, { useEffect, useState } from "react";
import axios from "axios";
import UserSidebar from "../../components/sidebar/UserSidebar";
import { FaTrashAlt, FaShoppingCart } from "react-icons/fa";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(res.data.items);
        setTotal(res.data.total);
      } catch (err) {
        console.error("Erreur lors du chargement du panier :", err);
      }
    };
    fetchCart();
  }, [token]);

  const handleRemove = async (id_product) => {
    try {
      await axios.delete(`http://localhost:8000/api/cart/remove/${id_product}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(cartItems.filter((item) => item.id_product !== id_product));
    } catch (err) {
      console.error("Erreur de suppression :", err);
    }
  };

  return (
    <div className="flex">
      <UserSidebar />
     <main className="flex-1 p-6 sm:p-8 w-full md:ml-64 mt-16 md:mt-0 flex justify-center">
  <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-dropsDark mb-6 flex items-center gap-2">
          <FaShoppingCart className="text-dropsGreen" /> Mon panier
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-gray-600 text-center mt-20">
            Votre panier est vide 🛒
          </div>
        ) : (
          <>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-dropsGreen text-white">
                  <tr>
                    <th className="p-3">Produit</th>
                    <th className="p-3">Prix</th>
                    <th className="p-3">Quantité</th>
                    <th className="p-3">Total</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id_product} className="border-b hover:bg-gray-50">
                      <td className="p-3 flex items-center gap-3">
                        <img
                          src={item.product?.image || "https://via.placeholder.com/60"}
                          alt={item.product?.nom}
                          className="w-12 h-12 rounded-md object-cover"
                        />
                        <span className="font-semibold text-dropsDark">
                          {item.product?.nom}
                        </span>
                      </td>
                      <td className="p-3">{item.product?.prix} €</td>
                      <td className="p-3">{item.quantite}</td>
                      <td className="p-3 font-semibold text-dropsGreen">
                        {(item.product?.prix * item.quantite).toFixed(2)} €
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleRemove(item.id_product)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-6">
              <h3 className="text-xl font-bold text-dropsDark">
                Total : <span className="text-dropsGreen">{total.toFixed(2)} €</span>
              </h3>
              <button className="bg-dropsGreen text-white px-6 py-3 rounded-lg hover:bg-dropsDark transition font-semibold">
                Passer la commande
              </button>
            </div>
          </>
        )}
        </div>
      </main>
    </div>
  );
}
