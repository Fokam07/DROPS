/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,css}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        dropsGreen: "#3BAF5D", // 🌿 Vert clair principal
        smokeWhite: "#F8F8F8", // ☁️ Blanc fumé
        dropsDark: "#2E7D32",  // 🌱 Variante foncée
      },
      fontFamily: {
    outfit: ["Outfit", "sans-serif"],
    sans: ["Poppins", "sans-serif"],
     montserrat: ['"Montserrat"', "sans-serif"],
  },
    },
  },
  plugins: [],
};

