import { useState } from "react";
import { ShoppingBag, Globe, Menu, X, Instagram } from "lucide-react";
import Image from "next/image";

export default function Navbar({ lang, setLang, page, setPage, cartCount }) {
  const [langOpen, setLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const NAV_LABELS = {
    en: { home: "Home", shop: "Shop", customizer: "Customizer", cart: "Cart" },
    hi: { home: "होम", shop: "शॉप", customizer: "कस्टमाइज़र", cart: "कार्ट" },
    gu: { home: "હોમ", shop: "શોપ", customizer: "કસ્ટમાઇઝર", cart: "કાર્ટ" },
  };
  const t = NAV_LABELS[lang];

  const navGo = (p) => { setPage(p); setMenuOpen(false); };

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 1000,
      background: "rgba(250,246,239,0.97)", backdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(201,168,76,0.2)",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 5%", height: 72, maxWidth: 1400, margin: "0 auto",
      }}>
        {/* Logo */}
        <div onClick={() => navGo("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
          <Image
            src="/logo.png"
            alt="Creatively Yours by Mugdha"
            width={160}
            height={60}
            style={{ objectFit: "contain", height: 50, width: "auto" }}
            priority
          />
        </div>

        {/* Desktop Nav Links */}
        <div className="sans" style={{
          display: "flex", gap: 36, alignItems: "center",
          fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase",
        }}
          id="desktop-nav"
        >
          {["home", "shop", "customizer"].map((p) => (
            <span
              key={p}
              onClick={() => navGo(p)}
              style={{
                cursor: "pointer", paddingBottom: 3,
                borderBottom: page === p ? "1.5px solid #C9A84C" : "1.5px solid transparent",
                color: page === p ? "#C9A84C" : "#3B1F0E",
                transition: "all 0.2s",
              }}
            >
              {t[p]}
            </span>
          ))}
        </div>

        {/* Right icons */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* Instagram */}
          <a
            href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/"}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}
            aria-label="Instagram"
          >
            <Instagram size={18} color="#C13584" />
          </a>
          {/* Language */}
          {/* <div style={{ position: "relative" }}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              style={{
                background: "none", border: "1px solid rgba(201,168,76,0.4)",
                padding: "6px 12px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 5,
              }}
              className="sans"
              aria-label="Change language"
            >
              <Globe size={12} color="#C9A84C" />
              <span style={{ fontSize: "0.62rem", letterSpacing: "0.1em", color: "#3B1F0E" }}>
                {lang.toUpperCase()}
              </span>
            </button>
            {langOpen && (
              <div style={{
                position: "absolute", right: 0, top: "110%",
                background: "#fff", border: "1px solid rgba(201,168,76,0.25)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.1)", zIndex: 200, minWidth: 140,
              }}>
                {[
                  { code: "en", label: "🇬🇧 English" },
                  { code: "hi", label: "🇮🇳 हिंदी" },
                  { code: "gu", label: "🏵️ ગુજરાતી" },
                ].map((l) => (
                  <div
                    key={l.code}
                    onClick={() => { setLang(l.code); setLangOpen(false); }}
                    className="sans"
                    style={{
                      padding: "11px 18px", cursor: "pointer",
                      fontSize: "0.72rem", letterSpacing: "0.05em",
                      background: lang === l.code ? "rgba(201,168,76,0.08)" : "#fff",
                      color: lang === l.code ? "#C9A84C" : "#3B1F0E",
                      borderBottom: "1px solid rgba(201,168,76,0.1)",
                      transition: "background 0.15s",
                    }}
                  >
                    {l.label}
                  </div>
                ))}
              </div>
            )}
          </div> */}

          {/* Cart */}
          <button
            onClick={() => navGo("cart")}
            style={{ background: "none", border: "none", cursor: "pointer", position: "relative", display: "flex" }}
            aria-label={`Cart (${cartCount} items)`}
          >
            <ShoppingBag size={21} color="#3B1F0E" />
            {cartCount > 0 && (
              <span style={{
                position: "absolute", top: -7, right: -8,
                background: "#C9A84C", color: "#fff", borderRadius: "50%",
                width: 17, height: 17, fontSize: "0.6rem",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "Montserrat, sans-serif", fontWeight: 600,
              }}>
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", display: "none" }}
            id="mobile-menu-btn"
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="sans fade-in" style={{
          background: "#FAF6EF", borderTop: "1px solid rgba(201,168,76,0.15)",
          padding: "20px 5%",
        }}>
          {["home", "shop", "customizer", "cart"].map((p) => (
            <div
              key={p}
              onClick={() => navGo(p)}
              style={{
                padding: "14px 0", borderBottom: "1px solid rgba(201,168,76,0.1)",
                fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase",
                cursor: "pointer", color: page === p ? "#C9A84C" : "#3B1F0E",
              }}
            >
              {t[p]}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          #desktop-nav { display: none !important; }
          #mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
