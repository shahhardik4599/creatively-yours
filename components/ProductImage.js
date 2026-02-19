import { useState } from "react";

const GRADIENTS = {
  womensday: "linear-gradient(135deg, #FFF0F5 0%, #FFE4EC 50%, #FFF5F0 100%)",
  spa:       "linear-gradient(135deg, #E8F5F0 0%, #D4EDE6 50%, #E8F5F0 100%)",
  wellness:  "linear-gradient(135deg, #F5F0FF 0%, #EAE0FF 50%, #F5F0FF 100%)",
  hamper:    "linear-gradient(135deg, #FFF8EC 0%, #FDECC8 50%, #FFF8EC 100%)",
  default:   "linear-gradient(135deg, #FAF6EF 0%, #F3EDE2 50%, #FAF6EF 100%)",
};

const EMOJIS = {
  womensday: "🌸",
  spa:       "🧖‍♀️",
  wellness:  "🌿",
  hamper:    "🎁",
  default:   "🎀",
};

export default function ProductImage({ src, alt, category = "default", style = {}, className = "" }) {
  const [error, setError] = useState(false);
  const gradient = GRADIENTS[category] || GRADIENTS.default;
  const emoji = EMOJIS[category] || EMOJIS.default;

  if (!src || error) {
    return (
      <div
        className={className}
        style={{
          background: gradient,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          ...style,
        }}
      >
        <span style={{ fontSize: "3rem", lineHeight: 1 }}>{emoji}</span>
        <span
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "0.58rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(59,31,14,0.45)",
            textAlign: "center",
          }}
        >
          Creatively Yours
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || "Product"}
      className={className}
      style={{ objectFit: "cover", ...style }}
      onError={() => setError(true)}
    />
  );
}
