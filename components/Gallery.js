import { useEffect, useState, useRef } from "react";

export default function Gallery({ images = [] }) {
  const [selected, setSelected] = useState(null);
  const containerRef = useRef(null);
  const [visibleMap, setVisibleMap] = useState({});

  useEffect(() => {
    const items = Array.from(containerRef.current?.querySelectorAll(".gallery-item") || []);
    if (!items.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const key = e.target.getAttribute("data-key");
          setVisibleMap((s) => ({ ...s, [key]: true }));
        }
      });
    }, { threshold: 0.12 });

    items.forEach((it) => obs.observe(it));
    return () => obs.disconnect();
  }, [images]);

  return (
    <section style={{ padding: "72px 8%", background: "#fff" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div className="sans" style={{ color: "#C9A84C", fontSize: "0.62rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 8 }}>Moments</div>
        <h2 style={{ fontSize: "2rem", fontWeight: 300 }}>Gallery — Hampers from our customers</h2>
        <p className="sans" style={{ color: "#888", marginTop: 8, fontSize: "0.9rem" }}>Real photos sent by customers — curated and cherished.</p>
      </div>

      <div ref={containerRef} style={{ columnCount: 3, columnGap: 18 }}>
        {images.map((src, i) => (
          <div
            key={i}
            data-key={i}
            className="gallery-item"
            onClick={() => setSelected(src)}
            style={{
              breakInside: "avoid", marginBottom: 18, cursor: "pointer",
              transformOrigin: "center bottom",
              transition: `transform 560ms cubic-bezier(.16,.9,.3,1) ${i * 80}ms, opacity 560ms ${i * 80}ms`,
              opacity: visibleMap[i] ? 1 : 0, transform: visibleMap[i] ? "translateY(0) scale(1)" : "translateY(28px) scale(0.985)",
            }}
          >
            <div style={{ overflow: "hidden", borderRadius: 12, boxShadow: "0 10px 36px rgba(17,17,17,0.06)" }}>
              <img
                src={src}
                alt={`gallery-${i}`}
                loading="lazy"
                style={{ width: "100%", display: "block", transform: "scale(1)", transition: "transform 280ms cubic-bezier(.2,.9,.3,1)" }}
                onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
              />
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }} onClick={() => setSelected(null)}>
          <img src={selected} alt="full" style={{ maxWidth: "92%", maxHeight: "92%", borderRadius: 8, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }} />
        </div>
      )}
    </section>
  );
}
