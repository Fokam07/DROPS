import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/admin/categories").then((res) => {
      setCategories(res.data);
    });
  }, []);

  return (
    <div className="mt-24 px-8">
      <h2 className="text-3xl font-bold text-dropsDark mb-8 text-center">
        Catégories disponibles 🗂️
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id_category}
            className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition cursor-pointer"
          >
            <h3 className="font-bold text-lg text-dropsDark mb-2">{cat.nom}</h3>
            <p className="text-gray-500">{cat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
