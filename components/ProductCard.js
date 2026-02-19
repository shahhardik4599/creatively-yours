import { Plus } from "lucide-react";
import ProductImage from "./ProductImage";

export default function ProductCard({ product, onAdd, onView }) {
  return (
    <div
      className="card-hover"
      onClick={() => onView && onView(product)}
      style={{
        background: "#fff",
        border: "1px solid rgba(201,168,76,0.15)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer"
      }}
    >
      {/* Image - Clickable to open modal */}
      <div 
        style={{ height: 230, overflow: "hidden", position: "relative", flexShrink: 0 }}
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          category={product.category}
          style={{ width: "100%", height: "100%" }}
        />
        {product.featured && (
          <div style={{
            position: "absolute", top: 12, left: 12,
            background: "#C9A84C", color: "#fff",
            padding: "4px 10px", fontSize: "0.58rem",
            fontFamily: "Montserrat, sans-serif",
            letterSpacing: "0.18em", textTransform: "uppercase",
          }}>
            Featured
          </div>
        )}
        {/* Code & Category Badges */}
        <div style={{
          position: "absolute", top: 12, right: 12,
          display: "flex", gap: 6, flexDirection: "row", alignItems: "flex-end"
        }}>
          {product.category && (
            <div style={{
              background: "rgba(59,31,14,0.85)", color: "rgba(250,246,239,0.9)",
              padding: "3px 9px", fontSize: "0.6rem",
              fontFamily: "Montserrat, sans-serif", letterSpacing: "0.08em",
              textTransform: "capitalize",
            }}>
              {product.category}
            </div>
          )}
          {product.code && (
            <div style={{
              background: "rgba(59,31,14,0.75)", color: "rgba(250,246,239,0.9)",
              padding: "3px 9px", fontSize: "0.6rem",
              fontFamily: "Montserrat, sans-serif", letterSpacing: "0.12em",
            }}>
              {product.code}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 22px 22px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h4 style={{ fontSize: "1.15rem", fontWeight: 400, marginBottom: 5, lineHeight: 1.3 }}>
          {product.name}
        </h4>
        <p
          className="sans"
          style={{ color: "#888", fontSize: "0.7rem", marginBottom: 12, lineHeight: 1.6, flex: 1 }}
        >
          {product.description}
        </p>

        {/* Items tag list */}
        {product.items && product.items.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 16 }}>
            {product.items.slice(0, 4).map((item) => (
              <span
                key={item}
                className="sans"
                style={{
                  fontSize: "0.58rem", letterSpacing: "0.06em",
                  background: "rgba(201,168,76,0.1)", color: "#8B6914",
                  padding: "3px 7px", borderRadius: 2,
                }}
              >
                {item}
              </span>
            ))}
            {product.items.length > 4 && (
              <span
                className="sans"
                style={{
                  fontSize: "0.58rem", letterSpacing: "0.06em",
                  background: "rgba(59,31,14,0.07)", color: "#888",
                  padding: "3px 7px", borderRadius: 2,
                }}
              >
                +{product.items.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Price + Add Button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#C9A84C", fontSize: "1.25rem", fontWeight: 400 }}>
            ₹{product.price}
          </span>
          <button
            className="btn-dark"
            onClick={() => onAdd(product)}
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus size={11} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
