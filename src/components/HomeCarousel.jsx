import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Importez vos images locales
import ventilateurs from "./assets/images/ventilateurs.jpg";
import airpords from "./assets/images/airpords.jpg";
import chaisebureau from "./assets/images/chaisebureau.jpg";
import nike from "./assets/images/nike.jpg";
import photo from "./assets/images/photo.jpg";

export default function HomeCarousel() {
  const slides = [
    {
      img: ventilateurs,
      text: "Découvrez nos nouveaux produits tendance 🛍️",
    },
    {
      img: nike,
      text: "Des chaussures stylées pour toutes les saisons 👟",
    },
    {
      img: chaisebureau,
      text: "Équipez votre maison avec les meilleurs équipements 🏠",
    },
    {
      img: photo,
      text: "Des montres et accessoires de luxe à prix doux ⌚",
    },
    {
      img: airpords,
      text: "Technologie, mode et confort — tout est ici 💫",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    pauseOnHover: true,
    fade: false,
    speed: 500,
  };

  return (
    <div className="mt-0">
      <Slider {...settings}>
        {slides.map((s, i) => (
          <div key={i} className="relative">
            <img
              src={s.img}
              alt={s.text}
              className="w-full h-[300px] sm:h-[350px] md:h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex justify-center items-center">
              <h2 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center px-4 drop-shadow-lg">
                {s.text}
              </h2>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}