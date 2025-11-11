export default function StarRating({ value = 5, size = 18 }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        style={{
          color: i <= value ? "#FFD700" : "#d1d5db",
          fontSize: size,
          marginRight: 2,
        }}
      >
        ★
      </span>
    );
  }
  return <div className="flex items-center">{stars}</div>;
}
