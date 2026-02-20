import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import {
  ShoppingBag, Plus, Minus, Sparkles, ArrowRight,
  Star, MessageCircle, Check, Filter, X, Package
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import ProductImage from "../components/ProductImage";
import ProductModal from "../components/ProductModal";
import Gallery from "../components/Gallery";
import { PRODUCTS, CATEGORIES, buildCategoriesFromContentful } from "../data/products";
import { TRANSLATIONS } from "../data/translations";
import { fetchContentfulEntry, fetchContentfulEntries, fetchCategoriesFromContentful, mapFields, fetchContentfulAssets } from "../lib/contentful";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";

// ─── Contentful fetcher for products
// Fetches all product entries from Contentful (required, no fallback to local)
async function fetchContentfulProducts() {
  const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
  const token = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;
  
  if (!spaceId || !token) {
    throw new Error("Contentful not configured");
  }

  try {
    const products = await fetchContentfulEntries("product", 100);
    
    if (!products || products.length === 0) {
      throw new Error("No products in Contentful");
    }

    
    // Map Contentful product entries to app format
    const mapped = products.map((entry) => ({
      id: entry.sys.id,
      name: entry.fields.name || "",
      code: entry.fields.code || "",
      description: entry.fields.description || "",
      items: Array.isArray(entry.fields.items) ? entry.fields.items : [],
      price: entry.fields.price || 0,
      category: entry.fields.category || "default",
      featured: entry.fields.featured || false,
      image: entry.fields.product_image || entry.fields.productImage || null, // Handle both snake_case and camelCase
    }));

    return mapped;
  } catch (err) {
    throw err; // Propagate error instead of silently returning null
  }
}

// ─── Contentful fetcher for testimonials
// Fetches all testimonial entries from Contentful
async function fetchContentfulTestimonials() {
  const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
  const token = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;
  
  if (!spaceId || !token) {
    throw new Error("Contentful not configured");
  }

  try {
    const testimonials = await fetchContentfulEntries("testimonial", 100);
    
    if (!testimonials || testimonials.length === 0) {
      throw new Error("No testimonials in Contentful");
    }

    // Map Contentful testimonial entries to app format
    const mapped = testimonials.map((entry) => {
      const fields = entry.fields;
      return {
        id: entry.sys.id,
        name: fields.cutomername || fields.customername || fields.customerName || fields['Customer Name'] || "",
        location: fields.location || fields.Location || "",
        text: fields.quote || fields.Quote || fields.testimonial || fields.Testimonial || "",
        rating: fields.rating || fields.Rating || 5,
      };
    });
    return mapped;
  } catch (err) {
    throw err;
  }
}

export default function Home() {
  const [lang, setLang] = useState("en");
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [filter, setFilter] = useState("all");
  const [categories, setCategories] = useState(CATEGORIES); // Start with default categories
  const [products, setProducts] = useState([]); // Start empty, will be populated from Contentful
  const [testimonials, setTestimonials] = useState([]); // Start empty, will be populated from Contentful
  const [cartNotif, setCartNotif] = useState(false);
  const [cartNotifName, setCartNotifName] = useState("");
  const [heroData, setHeroData] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);

  // Customizer state
  const [custStep, setCustStep] = useState(0);
  const [custBase, setCustBase] = useState(null); // object { name, price }
  const [custItems, setCustItems] = useState([]); // array of objects { name, price }
  const [custName, setCustName] = useState("");
  const [custMsg, setCustMsg] = useState("");
  // Build-your-own lists (fallback to translations). store objects { name, price }
  const defaultBasePrice = 1499;
  const defaultItemPrice = 150;
  const [byoBases, setByoBases] = useState(
    TRANSLATIONS[lang].customizer.bases.map((b) => (typeof b === "string" ? { name: b, price: defaultBasePrice } : { name: b.name || String(b), price: b.price || defaultBasePrice }))
  );
  const [byoItems, setByoItems] = useState(
    TRANSLATIONS[lang].customizer.items.map((it) => (typeof it === "string" ? { name: it, price: defaultItemPrice } : { name: it.name || String(it), price: it.price || defaultItemPrice }))
  );

  const t = TRANSLATIONS[lang];

  // Fetch hero section and products from Contentful on mount
  useEffect(() => {
    // Fetch categories from Contentful Product content type
    fetchCategoriesFromContentful()
      .then((categoryKeys) => {
        if (categoryKeys && categoryKeys.length > 0) {
          const builtCategories = buildCategoriesFromContentful(categoryKeys);
          setCategories(builtCategories);
        }
      })
      .catch((err) => {
      });

    // Fetch hero section
    const homeEntryId = process.env.NEXT_PUBLIC_CONTENTFUL_HOME_ENTRY_ID;
    if (homeEntryId) {
      fetchContentfulEntry(homeEntryId).then((entry) => {
        if (entry?.fields) {
          const mapped = mapFields(entry.fields, {
            mainTitle1: "maintitle1",
            mainTitle2: "maintitle2",
            subtext: "subtext",
            smalltext: "smalltext",
            heroImage: "heroImage",
          });
          setHeroData(mapped);
        }
      });
    }

    // Fetch products from Contentful
    fetchContentfulProducts()
      .then((data) => {
        if (data && data.length > 0) {
          setProducts(data);
        }
      })
      .catch((err) => {
        // Do not fall back to local products - require Contentful
      });

    // Fetch testimonials from Contentful
    fetchContentfulTestimonials()
      .then((data) => {
        if (data && data.length > 0) {
          setTestimonials(data);
        }
      })
      .catch((err) => {
        // Do not fall back to local testimonials - require Contentful
      });

    // Fetch Build-Your-Own (BYO) configuration entry (optional env override)
    const byoEntryId = process.env.NEXT_PUBLIC_CONTENTFUL_BYO_ENTRY_ID || "2YEekw2foFyhgBm4zEgPhj";
    if (byoEntryId) {
      fetchContentfulEntry(byoEntryId)
        .then((entry) => {
          if (entry?.fields) {
            // Expecting fields.byoBase and fields.byoItems as arrays (JSON editor in Contentful)
            const basesField = entry.fields.byoBase;
            const itemsField = entry.fields.byoItems;

            const bases = Array.isArray(basesField)
              ? basesField.map((b) => {
                  if (typeof b === "string") return { name: b, price: defaultBasePrice };
                  // If it's an object, try common keys
                  return { name: b.name || b.title || String(b), price: b.price || defaultBasePrice };
                })
              : null;

            const items = Array.isArray(itemsField)
              ? itemsField.map((it) => {
                  if (typeof it === "string") return { name: it, price: defaultItemPrice };
                  return { name: it.name || it.title || String(it), price: it.price || defaultItemPrice };
                })
              : null;

            if (bases && bases.length > 0) setByoBases(bases);
            if (items && items.length > 0) setByoItems(items);
          }
        })
        .catch(() => {});
    }

    // Fetch Gallery entry (array of media). Expects field `galleryImages`
    const galleryEntryId = process.env.NEXT_PUBLIC_CONTENTFUL_GALLERY_ENTRY_ID;
    if (galleryEntryId) {
      fetchContentfulEntry(galleryEntryId)
        .then((entry) => {
          const imagesField = entry?.fields?.galleryImages || entry?.fields?.images || null;
          if (Array.isArray(imagesField)) {
            // imagesField items may already be URLs (resolveAssets converts links earlier)
            const urls = imagesField.map((it) => (typeof it === "string" ? it : it.url || it.fields?.file?.url || String(it))).map((u) => (u?.startsWith("http") ? u : (u ? `https:${u}` : null))).filter(Boolean);
            if (urls.length) setGalleryImages(urls);
          }
        })
        .catch(() => {});
    } else {
      // Fallback: fetch assets by search term (useful when you've uploaded images to Media)
      const galleryQuery = process.env.NEXT_PUBLIC_CONTENTFUL_GALLERY_QUERY || "GalleryImage";
      fetchContentfulAssets(galleryQuery, 50)
        .then((urls) => {
          if (urls && urls.length > 0) setGalleryImages(urls);
        })
        .catch(() => {});
    }
  }, []);

  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setCartNotifName(product.name);
    setCartNotif(true);
    setTimeout(() => setCartNotif(false), 2400);
  }, []);

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));
  const updateQty = (id, delta) =>
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const sendWhatsApp = () => {
    if (cart.length === 0) return;
    const lines = cart.map(
      (i) => `• *${i.name}*${i.code ? ` (${i.code})` : ""} ×${i.qty} — ₹${(i.price * i.qty).toLocaleString("en-IN")}`
    );
    const msg =
      `🌸 *Creatively Yours by Mugdha — Gift Enquiry*\n\n` +
      `${lines.join("\n")}\n\n` +
      `💰 *Estimated Total: ₹${cartTotal.toLocaleString("en-IN")}*\n\n` +
      `Please confirm availability and final pricing. Thank you! 🙏`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const addCustomToCart = () => {
    if (!custBase) return;
    const basePrice = custBase.price || defaultBasePrice;
    const itemsPrice = custItems.reduce((s, it) => s + (it.price || defaultItemPrice), 0);
    const price = basePrice + itemsPrice;
    addToCart({
      id: `custom-${Date.now()}`,
      name: `${t.cart.customItem} (${custBase.name})`,
      code: "CUSTOM",
      description: custItems.length > 0 ? custItems.map((i) => i.name).join(", ") : "Custom hamper",
      items: custItems.map((i) => i.name),
      price,
      category: "hamper",
      image: null,
    });
    setCustStep(0); setCustBase(null); setCustItems([]);
    setCustName(""); setCustMsg("");
    setPage("cart");
  };

  const filtered = products.filter((p) => filter === "all" || p.category === filter);

  return (
    <>
      <Head>
        <title>Creatively Yours by Mugdha — Premium Bespoke Gifts</title>
      </Head>

      {/* Cart notification toast */}
      {cartNotif && (
        <div
          className="notif-in sans"
          style={{
            position: "fixed", top: 80, right: 20, zIndex: 9999,
            background: "#3B1F0E", color: "#C9A84C",
            padding: "12px 22px", boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            display: "flex", alignItems: "center", gap: 10,
            fontSize: "0.72rem", letterSpacing: "0.06em", maxWidth: 280,
          }}
        >
          <Check size={13} />
          <span style={{ color: "rgba(250,246,239,0.9)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            Added: {cartNotifName}
          </span>
        </div>
      )}

      <Navbar lang={lang} setLang={setLang} page={page} setPage={setPage} cartCount={cartCount} />

      <ProductModal product={selectedProduct} isOpen={showModal} onClose={() => setShowModal(false)} onAdd={addToCart} />

      {/* ══════════════════ HOME ══════════════════ */}
      {page === "home" && (
        <main>
          {/* Hero */}
          <section style={{
            position: "relative", minHeight: "92vh",
            background: "linear-gradient(135deg, #1E0E07 0%, #3B1F0E 45%, #5C3317 75%, #7A4520 100%)",
            display: "flex", alignItems: "center", overflow: "hidden",
          }}>
            {/* Decorative rings */}
            <div style={{ position: "absolute", top: "8%", right: "3%", width: 340, height: 340, border: "1px solid rgba(201,168,76,0.12)", borderRadius: "50%" }} />
            <div style={{ position: "absolute", top: "18%", right: "7%", width: 220, height: 220, border: "1px solid rgba(201,168,76,0.08)", borderRadius: "50%" }} />
            <div style={{ position: "absolute", bottom: "10%", left: "1%", fontSize: "12rem", opacity: 0.03, lineHeight: 1, userSelect: "none" }}>🌸</div>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 72% 50%, rgba(201,168,76,0.1) 0%, transparent 65%)" }} />

            {/* Content */}
              <div className="w-[100%] px-[8%] z-10 flex flex-col-reverse md:flex-row items-center gap-6 fade-up justify-center" style={{ paddingBottom: 48 }}>
              <div style={{ zIndex: 2, maxWidth: 680 }} className="fade-up">
                <div className="sans" style={{
                  color: "#C9A84C", fontSize: "0.65rem", letterSpacing: "0.35em",
                  textTransform: "uppercase", marginBottom: 28,
                  display: "flex", alignItems: "center", gap: 14,
                }}>
                  <span style={{ display: "inline-block", width: 44, height: 1, background: "#C9A84C" }} />
                  {heroData?.smalltext}
                </div>
                <h1 style={{
                  color: "#FAF6EF", fontSize: "clamp(2.8rem, 5.5vw, 5.2rem)",
                  fontWeight: 300, lineHeight: 1.1, marginBottom: 6,
                }}>
                  {heroData?.mainTitle1}
                </h1>
                <h1 style={{
                  color: "#C9A84C", fontSize: "clamp(2.8rem, 5.5vw, 5.2rem)",
                  fontWeight: 300, fontStyle: "italic", lineHeight: 1.1, marginBottom: 30,
                }}>
                  {heroData?.mainTitle2}
                </h1>
                <p className="sans" style={{
                  color: "rgba(250,246,239,0.65)", fontSize: "0.88rem",
                  lineHeight: 1.85, maxWidth: 480, marginBottom: 48, fontWeight: 300,
                }}>
                  {heroData?.subtext}
                </p>
                <div className="flex flex-col md:flex-row gap-4 md:gap-4" style={{ width: "100%", maxWidth: 480 }}>
                  <button className="btn-gold md:inline-flex flex-1 md:flex-none justify-center" onClick={() => setPage("customizer")}>
                    <Sparkles size={13} /> {t.hero.cta1}
                  </button>
                  <button className="btn-outline md:inline-flex flex-1 md:flex-none justify-center" onClick={() => setPage("shop")}>
                    {t.hero.cta2}
                  </button>
                </div>
              </div>

              {/* Hero image panel */}
              <div className="w-full md:w-[min(420px,46vw)] md:max-w-[560px] h-80 md:h-[min(420px,42vh)] flex items-center justify-center" style={{ transform: "translateY(-10%)" }}>
                <ProductImage
                  src={heroData?.heroImage}
                  alt="heroImage"
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
                />
              </div>

            </div>
            
          </section>

          {/* Categories */}
          {/* <section style={{ padding: "80px 8%", background: "#fff" }}>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <div className="sans" style={{ color: "#C9A84C", fontSize: "0.62rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12 }}>Explore</div>
              <h2 style={{ fontSize: "2.3rem", fontWeight: 300 }}>{t.sections.categories}</h2>
              <p className="sans" style={{ color: "#999", fontSize: "0.78rem", marginTop: 8 }}>{t.sections.categoriesSubtitle}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
              {[
                { key: "womensday", emoji: "🌸", bg: "linear-gradient(135deg,#FFF0F5,#FFE4EC)", label: "Women's Day Gifts", desc: "28 curated gift sets for her" },
                { key: "spa", emoji: "🧖‍♀️", bg: "linear-gradient(135deg,#E8F5F0,#D4EDE6)", label: "Spa Hampers", desc: "Relaxation in a beautiful box" },
                { key: "wellness", emoji: "🌿", bg: "linear-gradient(135deg,#F5F0FF,#EAE0FF)", label: "Wellness Gifts", desc: "Holistic self-care essentials" },
              ].map((cat) => (
                <div
                  key={cat.key}
                  className="card-hover"
                  onClick={() => { setFilter(cat.key); setPage("shop"); }}
                  style={{ cursor: "pointer", border: "1px solid rgba(201,168,76,0.15)", overflow: "hidden", background: "#FFFCF8" }}
                >
                  <div style={{ height: 180, background: cat.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4.5rem" }}>
                    {cat.emoji}
                  </div>
                  <div style={{ padding: "22px 26px 26px" }}>
                    <h3 style={{ fontSize: "1.3rem", fontWeight: 400, marginBottom: 6 }}>{cat.label}</h3>
                    <p className="sans" style={{ color: "#888", fontSize: "0.72rem", marginBottom: 16 }}>{cat.desc}</p>
                    <span className="sans" style={{ color: "#C9A84C", display: "flex", alignItems: "center", gap: 6, fontSize: "0.68rem", letterSpacing: "0.08em" }}>
                      Explore <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section> */}

          <hr className="section-divider" />

          {/* Featured Products */}
          <section style={{ padding: "80px 8%", background: "var(--cream)" }}>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <div className="sans" style={{ color: "#C9A84C", fontSize: "0.62rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12 }}>Curated</div>
              <h2 style={{ fontSize: "2.3rem", fontWeight: 300 }}>{t.sections.featured}</h2>
              <p className="sans" style={{ color: "#999", fontSize: "0.78rem", marginTop: 8 }}>{t.sections.featuredSubtitle}</p>
            </div>
            <div style={{ position: "relative" }}>
              <div style={{ overflow: "hidden" }}>
                <div className="hide-scroll" style={{ display: "flex", gap: 24, alignItems: "flex-start", overflowX: "auto", paddingBottom: 8, paddingTop: 6 }}>
                  {products.slice(0, 6).map((p, i) => (
                    <div key={p.id} className={`fade-up delay-${Math.min(i + 1, 5)}`} style={{ minWidth: 260, flex: "0 0 260px" }}>
                      <ProductCard product={p} onAdd={addToCart} onView={(product) => { setSelectedProduct(product); setShowModal(true); }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* subtle left/right fade overlays */}
              <div style={{ textAlign: "center", marginTop: 24 }}>
                <button className="btn-outline" onClick={() => setPage("shop")} style={{ padding: "12px 26px", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: 10 }}>
                  View All {products.length} Gifts <ArrowRight size={14} />
                </button>
              </div>
            </div>
            <style>{`.hide-scroll::-webkit-scrollbar{display:none}.hide-scroll{-ms-overflow-style:none;scrollbar-width:none}`}</style>
          </section>

          <hr className="section-divider" />

          {/* Testimonials */}
          <section style={{ padding: "80px 8%", background: "#fff" }}>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <div className="sans" style={{ color: "#C9A84C", fontSize: "0.62rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12 }}>Stories</div>
              <h2 style={{ fontSize: "2.3rem", fontWeight: 300 }}>{t.sections.testimonials}</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
              {testimonials.map((tm, i) => (
                <div key={i} className={`fade-up delay-${i + 1}`} style={{
                  background: "var(--cream)", padding: "36px",
                  border: "1px solid rgba(201,168,76,0.12)",
                }}>
                  <div style={{ display: "flex", gap: 3, marginBottom: 18 }}>
                    {[...Array(tm.rating)].map((_, j) => (
                      <Star key={j} size={13} fill="#C9A84C" color="#C9A84C" />
                    ))}
                  </div>
                  <p style={{ fontSize: "1.05rem", fontStyle: "italic", lineHeight: 1.75, marginBottom: 24, color: "#555" }}>
                    "{tm.text}"
                  </p>
                  <div>
                    <div className="sans" style={{ fontWeight: 600, fontSize: "0.72rem", letterSpacing: "0.08em" }}>{tm.name}</div>
                    <div className="sans" style={{ color: "#aaa", fontSize: "0.65rem", marginTop: 2 }}>{tm.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Gallery — customer photos */}
          {galleryImages.length > 0 && (
            <Gallery images={galleryImages} />
          )}

          {/* CTA Banner */}
          <section style={{
            background: "linear-gradient(135deg, #3B1F0E 0%, #5C3317 100%)",
            padding: "64px 8%", textAlign: "center",
          }}>
            <h2 style={{ color: "#FAF6EF", fontSize: "2rem", fontWeight: 300, marginBottom: 8 }}>
              Can't find what you're looking for?
            </h2>
            <p className="sans" style={{ color: "rgba(250,246,239,0.6)", fontSize: "0.8rem", marginBottom: 36 }}>
              Build your own bespoke hamper — every detail, your way.
            </p>
            <button className="btn-gold" onClick={() => setPage("customizer")}>
              <Sparkles size={13} /> Start Customising
            </button>
          </section>

          <Footer t={t} />
        </main>
      )}

      {/* ══════════════════ SHOP ══════════════════ */}
      {page === "shop" && (
        <main style={{ minHeight: "80vh" }}>
          <div style={{ padding: "56px 8% 80px" }} className="fade-in">
            {/* Header */}
            <div style={{ marginBottom: 44 }}>
              <div className="sans" style={{ color: "#C9A84C", fontSize: "0.62rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 10 }}>Catalogue</div>
              <h1 style={{ fontSize: "2.3rem", fontWeight: 300, marginBottom: 6 }}>{t.sections.shop}</h1>
              
            </div>

            {/* Filter bar */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40, flexWrap: "wrap" }}>
              <Filter size={13} color="#C9A84C" />
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setFilter(cat.key)}
                  className="sans"
                  style={{
                    padding: "8px 18px", fontSize: "0.68rem", letterSpacing: "0.1em",
                    textTransform: "uppercase", cursor: "pointer",
                    border: `1px solid ${filter === cat.key ? "#C9A84C" : "rgba(201,168,76,0.25)"}`,
                    background: filter === cat.key ? "#C9A84C" : "transparent",
                    color: filter === cat.key ? "#fff" : "#3B1F0E",
                    transition: "all 0.2s",
                  }}
                >
                  {cat.label[lang] || cat.label.en}
                </button>
              ))}
              <span className="sans" style={{ marginLeft: "auto", fontSize: "0.68rem", color: "#aaa" }}>
                {filtered.length} gifts
              </span>
            </div>

            {/* Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} onAdd={addToCart} onView={(product) => { setSelectedProduct(product); setShowModal(true); }} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>
                <Package size={40} style={{ marginBottom: 16, opacity: 0.4 }} />
                <p className="sans" style={{ fontSize: "0.8rem" }}>No products found in this category.</p>
              </div>
            )}
          </div>
          <Footer t={t} />
        </main>
      )}

      {/* ══════════════════ CUSTOMIZER ══════════════════ */}
      {page === "customizer" && (
        <main style={{ minHeight: "80vh" }}>
          <div style={{ padding: "56px 8% 80px" }} className="fade-in">
            <div style={{ marginBottom: 44 }}>
              <div className="sans" style={{ color: "#C9A84C", fontSize: "0.62rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 10 }}>Bespoke</div>
              <h1 style={{ fontSize: "2.3rem", fontWeight: 300, marginBottom: 6 }}>{t.sections.customizer}</h1>
              <p className="sans" style={{ color: "#999", fontSize: "0.78rem" }}>{t.sections.customizerSubtitle}</p>
            </div>

            {/* Step indicator */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 0, marginBottom: 44, maxWidth: 620 }}>
              {[t.customizer.step1, t.customizer.step2, t.customizer.step3, t.customizer.step4].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", flex: i < 3 ? 1 : "none" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: "50%",
                      border: `2px solid ${i <= custStep ? "#C9A84C" : "#ddd"}`,
                      background: i === custStep ? "#C9A84C" : i < custStep ? "rgba(201,168,76,0.18)" : "#fff",
                      color: i === custStep ? "#fff" : i < custStep ? "#C9A84C" : "#ccc",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.72rem", fontFamily: "Montserrat, sans-serif", fontWeight: 600,
                      transition: "all 0.3s",
                    }}>
                      {i < custStep ? <Check size={13} /> : i + 1}
                    </div>
                    <span className="sans" style={{
                      fontSize: "0.58rem", letterSpacing: "0.08em", textAlign: "center",
                      color: i <= custStep ? "#C9A84C" : "#bbb", textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}>
                      {s}
                    </span>
                  </div>
                  {i < 3 && (
                    <div style={{
                      flex: 1, height: 1, margin: "17px 6px 0",
                      background: i < custStep ? "#C9A84C" : "#e5e5e5",
                      transition: "background 0.3s",
                    }} />
                  )}
                </div>
              ))}
            </div>

            {/* Step panels */}
            <div style={{ maxWidth: 680, background: "#fff", border: "1px solid rgba(201,168,76,0.18)", padding: "40px" }}>

              {/* STEP 0 — Choose Base */}
              {custStep === 0 && (
                <div className="fade-up">
                  <h3 style={{ fontSize: "1.5rem", fontWeight: 300, marginBottom: 6 }}>{t.customizer.step1}</h3>
                  <p className="sans" style={{ color: "#aaa", fontSize: "0.72rem", marginBottom: 28 }}>Select the container for your hamper</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {byoBases.map((b, i) => {
                      const emojis = ["🪵", "🧺", "🟤", "🫙", "👜", "🌾"];
                      const idx = i;
                      const selected = custBase && custBase.name === b.name;
                      return (
                        <div
                          key={b.name + idx}
                          onClick={() => setCustBase(b)}
                          style={{
                            padding: "20px 16px", border: `2px solid ${selected ? "#C9A84C" : "rgba(201,168,76,0.18)"}`,
                            cursor: "pointer", textAlign: "center",
                            background: selected ? "rgba(201,168,76,0.07)" : "#FFFCF8",
                            transition: "all 0.2s",
                          }}
                        >
                          <div style={{ fontSize: "2.2rem", marginBottom: 8 }}>{emojis[idx] || "🎁"}</div>
                          <div className="sans" style={{ fontSize: "0.72rem", color: selected ? "#C9A84C" : "#3B1F0E", letterSpacing: "0.05em" }}>{b.name}</div>
                          <div className="sans" style={{ fontSize: "0.68rem", color: "#888", marginTop: 8 }}>₹{(b.price || defaultBasePrice).toLocaleString("en-IN")}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 1 — Add Items */}
              {custStep === 1 && (
                <div className="fade-up">
                  <h3 style={{ fontSize: "1.5rem", fontWeight: 300, marginBottom: 6 }}>{t.customizer.step2}</h3>
                  <p className="sans" style={{ color: "#aaa", fontSize: "0.72rem", marginBottom: 28 }}>
                    Select items — ₹150 per item added to base price
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {byoItems.map((item, i) => {
                      const sel = custItems.find((it) => it.name === item.name);
                      return (
                        <div
                          key={item.name + i}
                          onClick={() => setCustItems(sel ? custItems.filter((it) => it.name !== item.name) : [...custItems, item])}
                          style={{
                            padding: "12px 14px", border: `2px solid ${sel ? "#C9A84C" : "rgba(201,168,76,0.15)"}`,
                            cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
                            background: sel ? "rgba(201,168,76,0.07)" : "#FFFCF8", transition: "all 0.2s",
                          }}
                        >
                          <div style={{
                            width: 16, height: 16, border: `2px solid ${sel ? "#C9A84C" : "#ddd"}`,
                            borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center",
                            background: sel ? "#C9A84C" : "#fff", flexShrink: 0,
                          }}>
                            {sel && <Check size={9} color="#fff" />}
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                            <span className="sans" style={{ fontSize: "0.7rem", color: sel ? "#C9A84C" : "#3B1F0E" }}>{item.name}</span>
                            <span className="sans" style={{ fontSize: "0.68rem", color: "#888" }}>₹{(item.price || defaultItemPrice).toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {custItems.length > 0 && (
                    <div className="sans" style={{ marginTop: 20, fontSize: "0.72rem", color: "#C9A84C" }}>
                      {custItems.length} item{custItems.length > 1 ? "s" : ""} selected — Estimated: ₹{(() => {
                        const basePrice = (custBase?.price || defaultBasePrice);
                        const itemsPrice = custItems.reduce((s, it) => s + (it.price || defaultItemPrice), 0);
                        return (basePrice + itemsPrice).toLocaleString("en-IN");
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2 — Personalise */}
              {custStep === 2 && (
                <div className="fade-up">
                  <h3 style={{ fontSize: "1.5rem", fontWeight: 300, marginBottom: 28 }}>{t.customizer.step3}</h3>
                  <div style={{ marginBottom: 22 }}>
                    <label className="sans" style={{
                      display: "block", fontSize: "0.65rem", letterSpacing: "0.12em",
                      textTransform: "uppercase", color: "#aaa", marginBottom: 8,
                    }}>
                      {t.customizer.nameLabel}
                    </label>
                    <input
                      value={custName}
                      onChange={(e) => setCustName(e.target.value.slice(0, 100))}
                      placeholder={t.customizer.namePlaceholder}
                      maxLength={100}
                      style={{
                        width: "100%", border: "1px solid rgba(201,168,76,0.25)",
                        background: "#FFFCF8", padding: "12px 16px",
                        fontFamily: "Cormorant Garamond, serif", fontSize: "1.05rem", color: "#3B1F0E",
                      }}
                    />
                  </div>
                  <div>
                    <label className="sans" style={{
                      display: "block", fontSize: "0.65rem", letterSpacing: "0.12em",
                      textTransform: "uppercase", color: "#aaa", marginBottom: 8,
                    }}>
                      {t.customizer.messageLabel}
                    </label>
                    <textarea
                      value={custMsg}
                      onChange={(e) => setCustMsg(e.target.value.slice(0, 500))}
                      placeholder={t.customizer.messagePlaceholder}
                      maxLength={500}
                      rows={4}
                      style={{
                        width: "100%", border: "1px solid rgba(201,168,76,0.25)",
                        background: "#FFFCF8", padding: "12px 16px",
                        fontFamily: "Cormorant Garamond, serif", fontSize: "1.05rem",
                        color: "#3B1F0E", resize: "none",
                      }}
                    />
                    <div className="sans" style={{ textAlign: "right", fontSize: "0.62rem", color: "#ccc", marginTop: 4 }}>
                      {custMsg.length}/500
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 — Review */}
              {custStep === 3 && (
                <div className="fade-up">
                  <h3 style={{ fontSize: "1.5rem", fontWeight: 300, marginBottom: 24 }}>{t.customizer.step4}</h3>
                  <div style={{ background: "var(--cream)", padding: 28, border: "1px solid rgba(201,168,76,0.12)", marginBottom: 8 }}>
                    <Row label="Base" value={custBase ? custBase.name : "None selected"} />
                    <Row label={`Items (${custItems.length})`} value={custItems.length > 0 ? custItems.map((i) => i.name).join(", ") : "None selected"} />
                    {custName && <Row label="For" value={custName} />}
                    {custMsg && <Row label="Message" value={`"${custMsg}"`} italic />}
                    <div style={{ borderTop: "1px solid rgba(201,168,76,0.18)", paddingTop: 16, marginTop: 16 }}>
                      <span className="sans" style={{ fontSize: "0.72rem", color: "#C9A84C", letterSpacing: "0.08em" }}>
                        Estimated Total: ₹{(1499 + custItems.length * 150).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                  <p className="sans" style={{ fontSize: "0.65rem", color: "#bbb", marginTop: 8, lineHeight: 1.6 }}>
                    Final pricing confirmed by Mugdha via WhatsApp.
                  </p>
                </div>
              )}

              {/* Navigation */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36 }}>
                {custStep > 0
                  ? <button className="btn-outline" onClick={() => setCustStep(custStep - 1)}>{t.customizer.back}</button>
                  : <div />
                }
                {custStep < 3
                  ? (
                    <button
                      className="btn-gold"
                      onClick={() => { if (custStep === 0 && !custBase) return; setCustStep(custStep + 1); }}
                      style={{ opacity: custStep === 0 && !custBase ? 0.45 : 1, cursor: custStep === 0 && !custBase ? "not-allowed" : "pointer" }}
                    >
                      {t.customizer.next}
                    </button>
                  ) : (
                    <button className="btn-gold" onClick={addCustomToCart}>
                      <ShoppingBag size={13} /> {t.customizer.addToCart}
                    </button>
                  )
                }
              </div>
            </div>
          </div>
          <Footer t={t} />
        </main>
      )}

      {/* ══════════════════ CART ══════════════════ */}
      {page === "cart" && (
        <main style={{ minHeight: "80vh" }}>
          <div style={{ padding: "56px 8% 80px" }} className="fade-in">
            <div style={{ marginBottom: 44 }}>
              <div className="sans" style={{ color: "#C9A84C", fontSize: "0.62rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 10 }}>Review</div>
              <h1 style={{ fontSize: "2.3rem", fontWeight: 300, marginBottom: 6 }}>{t.sections.cart}</h1>
              <p className="sans" style={{ color: "#999", fontSize: "0.78rem" }}>{t.sections.cartSubtitle}</p>
            </div>

            {cart.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0 60px" }}>
                <div style={{ fontSize: "4rem", marginBottom: 20 }}>🛍️</div>
                <h3 style={{ fontSize: "1.8rem", fontWeight: 300, marginBottom: 10 }}>{t.cart.empty}</h3>
                <p className="sans" style={{ color: "#aaa", fontSize: "0.78rem", marginBottom: 36 }}>{t.cart.emptySubtitle}</p>
                <button className="btn-gold" onClick={() => setPage("shop")}>
                  Browse Collection
                </button>
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr min(380px, 100%)",
                gap: 36, alignItems: "start",
              }}>
                {/* Cart items list */}
                <div>
                  {cart.map((item) => (
                    <div key={item.id} style={{
                      display: "flex", gap: 18, padding: "22px 0",
                      borderBottom: "1px solid rgba(201,168,76,0.12)",
                      alignItems: "flex-start",
                    }}>
                      <div style={{ width: 84, height: 84, flexShrink: 0, overflow: "hidden" }}>
                        <ProductImage
                          src={item.image}
                          alt={item.name}
                          category={item.category}
                          style={{ width: "100%", height: "100%" }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                          <div>
                            <div style={{ fontSize: "1.1rem", marginBottom: 3 }}>{item.name}</div>
                            {item.code && (
                              <span className="sans" style={{
                                fontSize: "0.6rem", letterSpacing: "0.1em",
                                background: "rgba(201,168,76,0.1)", color: "#8B6914",
                                padding: "2px 7px", marginBottom: 4, display: "inline-block",
                              }}>
                                {item.code}
                              </span>
                            )}
                            <div className="sans" style={{ fontSize: "0.68rem", color: "#aaa", marginTop: 4, lineHeight: 1.5 }}>
                              {item.description}
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#C9A84C", flexShrink: 0, padding: 4 }}
                            aria-label="Remove item"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid rgba(201,168,76,0.25)" }}>
                            <button onClick={() => updateQty(item.id, -1)} style={{ padding: "5px 11px", background: "none", border: "none", cursor: "pointer", color: "#C9A84C" }}>
                              <Minus size={11} />
                            </button>
                            <span className="sans" style={{ padding: "5px 10px", fontSize: "0.8rem", borderLeft: "1px solid rgba(201,168,76,0.25)", borderRight: "1px solid rgba(201,168,76,0.25)" }}>
                              {item.qty}
                            </span>
                            <button onClick={() => updateQty(item.id, 1)} style={{ padding: "5px 11px", background: "none", border: "none", cursor: "pointer", color: "#C9A84C" }}>
                              <Plus size={11} />
                            </button>
                          </div>
                          <span style={{ color: "#C9A84C", fontSize: "1.1rem" }}>
                            ₹{(item.price * item.qty).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Continue shopping */}
                  <div style={{ marginTop: 24 }}>
                    <button className="btn-outline" onClick={() => setPage("shop")} style={{ fontSize: "0.65rem" }}>
                      + Add More Gifts
                    </button>
                  </div>
                </div>

                {/* Summary panel */}
                <div style={{
                  background: "#3B1F0E", padding: "36px",
                  position: "sticky", top: 88,
                }}>
                  <h3 style={{ color: "#C9A84C", fontSize: "1.2rem", fontWeight: 300, marginBottom: 24 }}>
                    Order Summary
                  </h3>

                  {cart.map((item) => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <span className="sans" style={{ fontSize: "0.68rem", color: "rgba(250,246,239,0.6)", flex: 1, paddingRight: 8 }}>
                        {item.name} ×{item.qty}
                      </span>
                      <span className="sans" style={{ fontSize: "0.68rem", color: "rgba(250,246,239,0.85)", flexShrink: 0 }}>
                        ₹{(item.price * item.qty).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}

                  <div style={{ borderTop: "1px solid rgba(201,168,76,0.2)", paddingTop: 18, marginTop: 18, marginBottom: 28 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span className="sans" style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(250,246,239,0.55)" }}>
                        {t.cart.total}
                      </span>
                      <span style={{ fontSize: "1.5rem", color: "#C9A84C", fontWeight: 300 }}>
                        ₹{cartTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <p className="sans" style={{ fontSize: "0.62rem", color: "rgba(250,246,239,0.38)", marginBottom: 22, lineHeight: 1.7 }}>
                    {t.cart.note}
                  </p>

                  <button
                    onClick={sendWhatsApp}
                    style={{
                      width: "100%", background: "#25D366", color: "#fff",
                      border: "none", padding: "15px", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                      fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem",
                      letterSpacing: "0.14em", textTransform: "uppercase", transition: "background 0.2s",
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "#1da851"}
                    onMouseOut={(e) => e.currentTarget.style.background = "#25D366"}
                  >
                    <MessageCircle size={15} /> {t.cart.whatsapp}
                  </button>
                </div>
              </div>
            )}
          </div>
          <Footer t={t} />
        </main>
      )}

      {/* Mobile responsive styles moved to styles/globals.css to avoid hydration mismatch */}
    </>
  );
}

// Helper component for customizer review rows
function Row({ label, value, italic }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <span className="sans" style={{ fontSize: "0.6rem", letterSpacing: "0.12em", color: "#aaa", textTransform: "uppercase", display: "block", marginBottom: 4 }}>
        {label}
      </span>
      <span style={{ fontSize: "0.95rem", color: "#3B1F0E", fontStyle: italic ? "italic" : "normal", lineHeight: 1.5 }}>
        {value}
      </span>
    </div>
  );
}
