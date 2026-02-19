# 🌸 Creatively Yours by Mugdha
### Premium Bespoke Gift & Decor Boutique

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local and set your WhatsApp number

# 3. Run locally
npm run dev
# Open http://localhost:3000

# 4. Build for production
npm run build && npm start
```

---

## 📸 Adding Product Images

Place product images in the `/public/products/` folder.  
Name them to match the product code: `WD1.jpg`, `WD2.jpg`, ... `WD28.jpg`

**Supported formats:** `.jpg`, `.jpeg`, `.png`, `.webp`

If an image is missing, a beautiful branded placeholder is shown automatically — **no broken images ever**.

---

## 🛒 Products

All 28 Women's Day gift sets are pre-loaded from `data/products.js`.  
To edit names, descriptions, prices or add new products, simply edit that file.

---

## 🌐 Contentful CMS (Optional)

Let Mugdha update images/products without touching code:

1. Create a free account at [contentful.com](https://contentful.com)
2. Create a **Space** called "Creatively Yours"
3. Create a **Content Type** called `product` with these fields:
   - `name` → Short Text
   - `code` → Short Text
   - `description` → Short Text
   - `items` → Short Text, List
   - `price` → Number
   - `category` → Short Text (`womensday` | `spa` | `wellness`)
   - `featured` → Boolean
   - `image` → Media
4. Add your Space ID and API token to `.env.local`
5. Mugdha can now log into Contentful and upload images/update products — the site updates automatically

---

## 📱 WhatsApp Integration

When a customer clicks **"Enquire via WhatsApp"**, a pre-formatted message is sent with:
- All selected products and quantities
- Product codes (e.g. WD1, WD4...)
- Estimated total
- Polite enquiry note

Set your number in `.env.local`:
```
NEXT_PUBLIC_WHATSAPP_NUMBER=919998887777
```

---

## 🔒 Security Features

| Threat | Protection |
|---|---|
| SQL Injection | No SQL — Contentful read-only CDN API |
| XSS | React JSX escaping, no `dangerouslySetInnerHTML` |
| Clickjacking | `X-Frame-Options: DENY` + `frame-ancestors 'none'` |
| MIME Sniffing | `X-Content-Type-Options: nosniff` |
| HTTPS Downgrade | HSTS header (2 year max-age) |
| WhatsApp Injection | `encodeURIComponent()` on all user input |
| Input Overflow | `maxLength` on all text fields |
| Open Redirects | Only `wa.me` domain opened, never dynamic URLs |

---

## 🌍 Languages Supported

- 🇬🇧 English
- 🇮🇳 Hindi (हिंदी)
- 🏵️ Gujarati (ગુજરાતી)

Use the language toggle in the navbar to switch instantly.

---

## 📁 Project Structure

```
creatively-yours/
├── components/
│   ├── Navbar.js          # Sticky nav with language toggle
│   ├── Footer.js          # Footer with WhatsApp CTA
│   ├── ProductCard.js     # Product grid card
│   └── ProductImage.js    # Image with auto-placeholder
├── data/
│   ├── products.js        # All 28 products from catalog
│   └── translations.js    # EN / HI / GU translations
├── pages/
│   ├── _app.js
│   ├── _document.js
│   └── index.js           # Main app (Home/Shop/Customizer/Cart)
├── public/
│   ├── logo.png           # Creatively Yours by Mugdha logo
│   └── products/          # Add WD1.jpg ... WD28.jpg here
├── styles/
│   └── globals.css        # Design system & animations
├── next.config.js         # Security headers
└── .env.example           # Environment variables template
```

---

Built with ❤️ for Mugdha
