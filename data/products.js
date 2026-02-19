// All products extracted from Womens_Day_Gifts-2026.pdf catalog
// Images: Add product images to /public/products/ folder (e.g. WD1.jpg, WD2.jpg...)
// If no image is found, a beautiful branded placeholder is shown automatically.

// Category translations - used to build CATEGORIES array from Contentful data
// Maps category keys to display labels in all supported languages
export const CATEGORY_TRANSLATIONS = {
  birthday: { en: "Birthday", hi: "जन्मदिन", gu: "જન્મદિન" },
  womensday: { en: "Women's Day", hi: "महिला दिवस", gu: "મહિલા દિવસ" },
  spa: { en: "Spa Hampers", hi: "स्पा हैम्पर", gu: "સ્પા હેમ્પર" },
  wellness: { en: "Wellness", hi: "वेलनेस", gu: "વેલનેસ" },
  wedding: { en: "Wedding", hi: "शादी", gu: "લગ્ન" },
};

// Default categories (fallback) - will be replaced with Contentful data
export const DEFAULT_CATEGORIES = [
  { key: "all", label: { en: "All", hi: "सभी", gu: "બધા" } },
  { key: "womensday", label: CATEGORY_TRANSLATIONS.womensday },
  { key: "spa", label: CATEGORY_TRANSLATIONS.spa },
  { key: "wellness", label: CATEGORY_TRANSLATIONS.wellness },
  { key: "wedding", label: CATEGORY_TRANSLATIONS.wedding },
];

// This will be populated dynamically from Contentful
export let CATEGORIES = DEFAULT_CATEGORIES;

/**
 * Build categories array from Contentful category keys
 * @param {Array} contentfulCategoryKeys - Category keys from Contentful (e.g., ["womensday", "spa"])
 * @returns {Array} CATEGORIES array with "All" option + translated categories
 */
export function buildCategoriesFromContentful(contentfulCategoryKeys) {
  if (!contentfulCategoryKeys || contentfulCategoryKeys.length === 0) {
    console.warn("⚠️ No categories provided, using defaults");
    return DEFAULT_CATEGORIES;
  }

  const categories = [{ key: "all", label: { en: "All", hi: "सभी", gu: "બધા" } }];

  contentfulCategoryKeys.forEach((categoryKey) => {
    const translation = CATEGORY_TRANSLATIONS[categoryKey];
    if (translation) {
      categories.push({ key: categoryKey, label: translation });
    } else {
      console.warn(`⚠️ No translation found for category: ${categoryKey}`);
      // Still add it with the key as fallback
      categories.push({ key: categoryKey, label: { en: categoryKey, hi: categoryKey, gu: categoryKey } });
    }
  });

  console.log("✅ Built categories from Contentful:", categories);
  CATEGORIES = categories;
  return categories;
}

export const PRODUCTS = [
  {
    id: "WD1",
    name: "Glam Starter Kit",
    code: "WD1",
    description: "A perfect beauty starter featuring Maybelline Kajal, Nykaa Lip Balm, Earrings, Scrunchie, Waffle Cigar, Strawberry Rocher & Message Card",
    items: ["Maybelline Kajal", "Nykaa Lip Balm", "Earrings", "Scrunchie", "Waffle Cigar", "Strawberry Rocher", "Message Card"],
    price: 999,
    category: "womensday",
    featured: true,
    image: "/products/WD1.jpg",
  },
  {
    id: "WD2",
    name: "Chic Essentials Box",
    code: "WD2",
    description: "A minimal yet elegant gift featuring Pouch, Scrunchie, Earrings, Choco Biscuit & a personalised Message Card",
    items: ["Pouch", "Scrunchie", "Earrings", "Choco Biscuit", "Message Card"],
    price: 799,
    category: "womensday",
    featured: false,
    image: "/products/WD2.jpg",
  },
  {
    id: "WD3",
    name: "Glow & Go Hamper",
    code: "WD3",
    description: "Skincare delight with Pouch, Pocket Mirror, Face Mask, Insight Lip & Cheek Tint, Cadbury Choco Bake & Message Card",
    items: ["Pouch", "Pocket Mirror", "Face Mask", "Insight Lip & Cheek Tint", "Cadbury Choco Bake", "Message Card"],
    price: 1099,
    category: "womensday",
    featured: true,
    image: "/products/WD3.jpg",
  },
  {
    id: "WD4",
    name: "Personalised Pink Pouch Set",
    code: "WD4",
    description: "Premium personalised set with Pink Leather Pouch (Personalised), Pocket Mirror, Nykaa Lip Balm, Scalp Massage Brush & Message Card",
    items: ["Pink Leather Pouch (Personalised)", "Pocket Mirror", "Nykaa Lip Balm", "Scalp Massage Brush", "Message Card"],
    price: 1299,
    category: "womensday",
    featured: true,
    image: "/products/WD4.jpg",
  },
  {
    id: "WD5",
    name: "Jewel & Glow Box",
    code: "WD5",
    description: "Sparkle with an LED Jewellery Box, Scrunchie, Bracelet, Earrings & a heartfelt Message Card",
    items: ["LED Jewellery Box", "Scrunchie", "Bracelet", "Earrings", "Message Card"],
    price: 1499,
    category: "womensday",
    featured: true,
    image: "/products/WD5.jpg",
  },
  {
    id: "WD6",
    name: "Cosy Morning Hamper",
    code: "WD6",
    description: "Start mornings beautifully with a Ceramic Cup, Hand-made Cookie & personalised Message Card",
    items: ["Ceramic Cup", "Hand-made Cookie", "Message Card"],
    price: 699,
    category: "womensday",
    featured: false,
    image: "/products/WD6.jpg",
  },
  {
    id: "WD7",
    name: "Skincare & Scent Set",
    code: "WD7",
    description: "Pamper her with Dr Rasheel De Tan Scrub, Yardley Pocket Perfume, Insight Lip And Cheek Tint, Strawberry Rochers (2) & Message Card",
    items: ["Dr Rasheel De Tan Scrub", "Yardley Pocket Perfume", "Insight Lip And Cheek Tint", "Strawberry Rochers (2)", "Message Card"],
    price: 1199,
    category: "womensday",
    featured: false,
    image: "/products/WD7.jpg",
  },
  {
    id: "WD8",
    name: "Body Bliss Hamper",
    code: "WD8",
    description: "Relaxing self-care with Body Scrub, Nykaa Lip Balm, Scrunchie, Earrings & Message Card",
    items: ["Body Scrub", "Nykaa Lip Balm", "Scrunchie", "Earrings", "Message Card"],
    price: 999,
    category: "womensday",
    featured: false,
    image: "/products/WD8.jpg",
  },
  {
    id: "WD9",
    name: "Lip Love Kit",
    code: "WD9",
    description: "All about lips — Strawberry Lip Scrub, Scrunchie, Kit Kat, Nykaa Lip Balm Jar & Message Card",
    items: ["Strawberry Lip Scrub", "Scrunchie", "Kit Kat", "Nykaa Lip Balm Jar", "Message Card"],
    price: 849,
    category: "womensday",
    featured: false,
    image: "/products/WD9.jpg",
  },
  {
    id: "WD10",
    name: "Glam Jewellery Box Set",
    code: "WD10",
    description: "Luxurious Jewellery Box, Lip Gloss, Scrunchie & Message Card — a gift she'll cherish",
    items: ["Jewellery Box", "Lip Gloss", "Scrunchie", "Message Card"],
    price: 1099,
    category: "womensday",
    featured: false,
    image: "/products/WD10.jpg",
  },
  {
    id: "WD11",
    name: "Wanderlust Travel Kit",
    code: "WD11",
    description: "For the traveller — Bag, Personalised Passport Cover, Luggage Tag, Bella Vita Perfume & Message Card",
    items: ["Bag", "Passport Cover (Personalised)", "Luggage Tag", "Bella Vita Perfume", "Message Card"],
    price: 1799,
    category: "womensday",
    featured: true,
    image: "/products/WD11.jpg",
  },
  {
    id: "WD12",
    name: "Healthy Gourmet Hamper",
    code: "WD12",
    description: "Nutritious & delicious — Makhana Jar, Aashirvaad Instant Upma, Orika Lemonade Pouch, Roasted Almonds, Mindful Ragi Bar & Message Card",
    items: ["Makhana Jar", "Aashirvaad Instant Upma", "Orika Lemonade Pouch", "Roasted Almonds", "Mindful Ragi Bar", "Message Card"],
    price: 1299,
    category: "womensday",
    featured: false,
    image: "/products/WD12.jpg",
  },
  {
    id: "WD13",
    name: "Chic Bag & Jewels Set",
    code: "WD13",
    description: "Stylish Bag, Ceramic Cup, Fancy Jewellery Box, Earrings (2) & Message Card — a complete treat",
    items: ["Bag", "Ceramic Cup", "Fancy Jewellery Box", "Earrings (2)", "Message Card"],
    price: 1699,
    category: "womensday",
    featured: false,
    image: "/products/WD13.jpg",
  },
  {
    id: "WD14",
    name: "Candle & Jewels Hamper",
    code: "WD14",
    description: "Jewellery Pouch, Earrings (2), Candle, Plum Lip Balm & Message Card — a gift that glows",
    items: ["Jewellery Pouch", "Earrings (2)", "Candle", "Plum Lip Balm", "Message Card"],
    price: 1199,
    category: "womensday",
    featured: false,
    image: "/products/WD14.jpg",
  },
  {
    id: "WD15",
    name: "Office Essentials Kit",
    code: "WD15",
    description: "Practical & stylish — Canvas Bag, Diary, Pen, Coaster, Water Bottle & Message Card",
    items: ["Canvas Bag", "Diary", "Pen", "Coaster", "Water Bottle", "Message Card"],
    price: 1499,
    category: "womensday",
    featured: false,
    image: "/products/WD15.jpg",
  },
  {
    id: "WD16",
    name: "Self-Care Canvas Set",
    code: "WD16",
    description: "Canvas Bag, Pouch, Body Scrub, Face Mask & Message Card — the perfect pampering package",
    items: ["Canvas Bag", "Pouch", "Body Scrub", "Face Mask", "Message Card"],
    price: 1299,
    category: "womensday",
    featured: false,
    image: "/products/WD16.jpg",
  },
  {
    id: "WD17",
    name: "Personalised Black Canvas Set",
    code: "WD17",
    description: "All personalised — Black Canvas Bag, Pouch, Eye Mask, Luggage Tag + Scrunchie & Message Card",
    items: ["Black Canvas Bag", "Pouch (Personalised)", "Eye Mask (Personalised)", "Luggage Tag (Personalised)", "Scrunchie", "Message Card"],
    price: 1999,
    category: "womensday",
    featured: true,
    image: "/products/WD17.jpg",
  },
  {
    id: "WD18",
    name: "Personalised Bottle Set",
    code: "WD18",
    description: "Black Canvas Bag, Personalised Pouch, White Temperature Bottle & Message Card",
    items: ["Black Canvas Bag", "Pouch (Personalised)", "White Temperature Bottle", "Message Card"],
    price: 1599,
    category: "womensday",
    featured: false,
    image: "/products/WD18.jpg",
  },
  {
    id: "WD19",
    name: "Spa Hamper — Small",
    code: "WD19",
    description: "A curated small spa hamper for a relaxing self-care experience. Contents vary seasonally.",
    items: ["Curated Spa Products", "Message Card"],
    price: 1299,
    category: "spa",
    featured: true,
    image: "/products/WD19.jpg",
  },
  {
    id: "WD20",
    name: "Spa Hamper — Big",
    code: "WD20",
    description: "A luxurious big spa hamper loaded with premium self-care products for ultimate relaxation.",
    items: ["Premium Spa Products", "Message Card"],
    price: 2199,
    category: "spa",
    featured: true,
    image: "/products/WD20.jpg",
  },
  {
    id: "WD21",
    name: "Brownie & Bling Box",
    code: "WD21",
    description: "Sweet and sparkling — Cadbury Brownie Box, Necklace, Scrunchie, Phone Wristlet & Message Card",
    items: ["Cadbury Brownie Box", "Necklace", "Scrunchie", "Phone Wristlet", "Message Card"],
    price: 1199,
    category: "womensday",
    featured: false,
    image: "/products/WD21.jpg",
  },
  {
    id: "WD22",
    name: "Wellness Ritual Set",
    code: "WD22",
    description: "Holistic wellness with Essential Oil, Candle, Immunity Booster Powder, Ragi Bar & Message Card",
    items: ["Essential Oil", "Candle", "Immunity Booster Powder", "Ragi Bar", "Message Card"],
    price: 1399,
    category: "wellness",
    featured: false,
    image: "/products/WD22.jpg",
  },
  {
    id: "WD23",
    name: "Jewellery & Treats Box",
    code: "WD23",
    description: "Complete jewellery set — Scrunchie, Earrings, Necklace, Bracelet + Waffle Thin, Choco Biscuit & Message Card",
    items: ["Scrunchie", "Earrings", "Necklace", "Bracelet", "Waffle Thin", "Choco Biscuit", "Message Card"],
    price: 1599,
    category: "womensday",
    featured: true,
    image: "/products/WD23.jpg",
  },
  {
    id: "WD24",
    name: "Lip Luxe Collection",
    code: "WD24",
    description: "A full lip wardrobe — Nykaa Lip Balm, Lip Scrub, Insight Lip & Cheek, Insight Lip Gloss + Waffle Thin, Choco Biscuit & Message Card",
    items: ["Nykaa Lip Balm", "Lip Scrub", "Insight Lip and Cheek", "Insight Lip Gloss", "Waffle Thin", "Choco Biscuit", "Message Card"],
    price: 1399,
    category: "womensday",
    featured: false,
    image: "/products/WD24.jpg",
  },
  {
    id: "WD25",
    name: "Daily Luxe Kit",
    code: "WD25",
    description: "Bottle, Diary, Hair Brush, Candle, Chocolate Bar & Message Card — elevate every day",
    items: ["Bottle", "Diary", "Hair Brush", "Candle", "Chocolate Bar", "Message Card"],
    price: 1499,
    category: "womensday",
    featured: false,
    image: "/products/WD25.jpg",
  },
  {
    id: "WD26",
    name: "Personalised Dream Set",
    code: "WD26",
    description: "Big Bag (Personalised), Cap (Personalised), Small Dreamcatcher, Hand Towel & Message Card",
    items: ["Big Bag (Personalised)", "Cap (Personalised)", "Small Dreamcatcher", "Hand Towel", "Message Card"],
    price: 2299,
    category: "womensday",
    featured: false,
    image: "/products/WD26.jpg",
  },
  {
    id: "WD27",
    name: "Jute & Charms Set",
    code: "WD27",
    description: "Eco-chic — Big Bag (Personalised), Pouch Jute (Personalised), Charms Bracelet, Foot Mask & Message Card",
    items: ["Big Bag (Personalised)", "Pouch Jute (Personalised)", "Charms Bracelet", "Foot Mask", "Message Card"],
    price: 2099,
    category: "womensday",
    featured: false,
    image: "/products/WD27.jpg",
  },
  {
    id: "WD28",
    name: "Traveller's Comfort Kit",
    code: "WD28",
    description: "Travel in comfort — Neck Pillow, Eye Mask, Passport Cover, Luggage Tag & Message Card",
    items: ["Neck Pillow", "Eye Mask", "Passport Cover", "Luggage Tag", "Message Card"],
    price: 1799,
    category: "womensday",
    featured: true,
    image: "/products/WD28.jpg",
  },
];
