import { useEffect } from "react";
import { X } from "lucide-react";
import ProductImage from "./ProductImage";

export default function ProductModal({ product, isOpen, onClose, onAdd }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 999,
          animation: "fadeIn 0.2s ease-in-out",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#fff",
          borderRadius: 0,
          zIndex: 1000,
          maxHeight: "90vh",
          width: "90%",
          maxWidth: 900,
          overflow: "auto",
          animation: "slideUp 0.3s ease-out",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, minHeight: "100%", overflowY: "hidden" }}>
          {/* Image Section */}
          <div
            style={{
              height: 500,
              background: "#f9f7f3",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <ProductImage
              src={product.image}
              alt={product.name}
              category={product.category}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Content Section */}
          <div style={{ padding: "48px 40px", position: "relative", overflowY: "auto", maxHeight: 500 }}>
            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#aaa",
                padding: 0,
              }}
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            {/* Code & Category Badge */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {product.code && (
                <span
                  className="sans"
                  style={{
                    display: "inline-block",
                    background: "rgba(201,168,76,0.1)",
                    color: "#8B6914",
                    padding: "4px 12px",
                    fontSize: "0.6rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  {product.code}
                </span>
              )}
              {product.category && (
                <span
                  className="sans"
                  style={{
                    display: "inline-block",
                    background: "rgba(201,168,76,0.15)",
                    color: "#8B6914",
                    padding: "4px 12px",
                    fontSize: "0.6rem",
                    letterSpacing: "0.12em",
                    textTransform: "capitalize",
                  }}
                >
                  {product.category}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 style={{ fontSize: "2rem", fontWeight: 300, marginBottom: 12, lineHeight: 1.2 }}>
              {product.name}
            </h2>

            {/* Price */}
            <div
              style={{
                fontSize: "1.8rem",
                color: "#C9A84C",
                fontWeight: 400,
                marginBottom: 28,
              }}
            >
              ₹{product.price.toLocaleString("en-IN")}
            </div>

            {/* Description */}
            {product.description && (
              <p
                style={{
                  color: "#666",
                  fontSize: "0.95rem",
                  lineHeight: 1.8,
                  marginBottom: 28,
                }}
              >
                {product.description}
              </p>
            )}

            {/* Category */}
            {product.category && (
              <div style={{ marginBottom: 28 }}>
                <div className="sans" style={{ fontSize: "0.65rem", color: "#aaa", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
                  Category
                </div>
                <div style={{ fontSize: "0.95rem", color: "#3B1F0E", textTransform: "capitalize" }}>
                  {product.category}
                </div>
              </div>
            )}

            {/* Items Included */}
            {product.items && product.items.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div className="sans" style={{ fontSize: "0.65rem", color: "#aaa", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
                  Includes
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {product.items.map((item) => (
                    <li
                      key={item}
                      style={{
                        fontSize: "0.9rem",
                        color: "#555",
                        padding: "8px 0",
                        borderBottom: "1px solid rgba(201,168,76,0.08)",
                      }}
                    >
                      ✓ {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={() => {
                onAdd(product);
                onClose();
              }}
              style={{
                width: "100%",
                background: "#C9A84C",
                color: "#fff",
                border: "none",
                padding: "15px",
                fontSize: "0.75rem",
                fontFamily: "Montserrat, sans-serif",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: "pointer",
                marginTop: 12,
                transition: "background 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#b8942a")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#C9A84C")}
            >
              + Add to Cart
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, -45%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }

        @media (max-width: 768px) {
          div[style*="display: grid"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
