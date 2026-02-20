import { MessageCircle, Instagram } from "lucide-react";
import Image from "next/image";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";

export default function Footer({ t }) {
  return (
    <footer style={{
      background: "#3B1F0E",
      color: "rgba(250,246,239,0.65)",
      padding: "60px 8% 36px",
    }}>
      <div className="flex flex-col md:flex-row md:justify-center md:items-center" style={{ gap: 60, marginBottom: 48 }}>
        {/* Brand */}
        <div className="md:flex md:flex-col md:items-center" style={{ gap: 16 }}>
          <Image
            src="/logo.png"
            alt="Creatively Yours by Mugdha"
            width={140}
            height={56}
            style={{ objectFit: "contain", height: 48, width: "auto", marginBottom: 16, filter: "brightness(1.2)" }}
          />
          <p className="sans" style={{ fontSize: "0.72rem", lineHeight: 1.8, maxWidth: 240 }}>
            {t.footer.tagline}
          </p>
        </div>

        {/* Quick links */}
        {/* <div>
          <div className="sans" style={{
            fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase",
            color: "#C9A84C", marginBottom: 16,
          }}>
            Quick Links
          </div>
          {["Women's Day Gifts", "Spa Hampers", "Custom Hampers", "Wellness Gifts"].map((link) => (
            <div key={link} className="sans" style={{
              fontSize: "0.73rem", marginBottom: 10, color: "rgba(250,246,239,0.55)",
              cursor: "pointer", transition: "color 0.2s",
            }}
              onMouseOver={(e) => e.currentTarget.style.color = "#C9A84C"}
              onMouseOut={(e) => e.currentTarget.style.color = "rgba(250,246,239,0.55)"}
            >
              {link}
            </div>
          ))}
        </div> */}

        {/* Contact */}
        <div className="flex flex-col items-start md:items-center" style={{ justifyContent: "center" }}>
          <div className="sans" style={{
            fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase",
            color: "#C9A84C", marginBottom: 16,
          }}>
            Get In Touch
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#25D366", color: "#fff", padding: "10px 18px",
              textDecoration: "none", fontFamily: "Montserrat, sans-serif",
              fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            <MessageCircle size={13} /> {t.footer.whatsapp}
          </a>
          <div style={{ marginTop: 8 }}>
            <a
              href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/"}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#E1306C", color: "#fff", padding: "8px 14px",
                textDecoration: "none", fontFamily: "Montserrat, sans-serif",
                fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase",
              }}
            >
              <Instagram size={13} /> {t.footer.instagram || "Instagram"}
            </a>
          </div>
          <p className="sans" style={{ fontSize: "0.7rem", marginTop: 12, lineHeight: 1.7 }}>
            Orders & enquiries via WhatsApp/Instagram only.
          </p>
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.08)", marginBottom: 24 }} />

      <div className="flex flex-col" style={{ gap: 8 }}>
        <p className="sans" style={{ fontSize: "0.62rem", letterSpacing: "0.06em" }}>
          {t.footer.rights}
        </p>
        <p className="sans" style={{ fontSize: "0.62rem", letterSpacing: "0.06em" }}>
          Designed with ❤️ for Mugdha
        </p>
      </div>
    </footer>
  );
}
