/**
 * Contentful API Helper
 * Provides functions to fetch content from Contentful CMS
 */

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;
const BASE_URL = `https://cdn.contentful.com/spaces/${SPACE_ID}`;

/**
 * Fetch a single entry by ID from Contentful
 * @param {string} entryId - Contentful entry ID
 * @returns {Promise<Object|null>} Entry data with resolved asset URLs, or null if error
 */
export async function fetchContentfulEntry(entryId) {
  if (!SPACE_ID || !ACCESS_TOKEN) return null;

  try {
    // Try with include=2 first (often works better than higher values)
    const url = `${BASE_URL}/entries/${entryId}?access_token=${ACCESS_TOKEN}&include=2`;
    const res = await fetch(url);

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    
    const resolved = await resolveAssets(data);
    
    return resolved;
  } catch (err) {
    return null;
  }
}

/**
 * Fetch multiple entries by content type
 * @param {string} contentType - Content type ID (e.g., "product")
 * @param {number} limit - Max entries to fetch (default 100)
 * @returns {Promise<Array|null>} Array of entries or null if error
 */
export async function fetchContentfulEntries(contentType, limit = 100) {
  if (!SPACE_ID || !ACCESS_TOKEN) return null;

  try {
    const url = `${BASE_URL}/entries?content_type=${contentType}&access_token=${ACCESS_TOKEN}&include=10&limit=${limit}`;
    const res = await fetch(url);

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    
    // Resolve assets for all entries (await all promises)
    const resolved = await Promise.all(data.items.map((item) => resolveAssets(item)));
    
    return resolved;
  } catch (err) {
    return null;
  }
}

/**
 * Resolve asset links in an entry
 * Converts asset references to full URLs (tries includes first, then direct fetch)
 * @param {Object} entry - Contentful entry object
 * @returns {Promise<Object>} Entry with asset URLs resolved
 */
async function resolveAssets(entry) {
  if (!entry.fields) return entry;

  const fields = { ...entry.fields };
  const assets = entry.includes?.Asset || [];

  // Recursively resolve all asset references
  for (const key of Object.keys(fields)) {
    const field = fields[key];

    // Handle direct asset link
    if (field && typeof field === "object" && field.sys?.type === "Link" && field.sys?.linkType === "Asset") {
      const assetId = field.sys.id;
      
      let asset = assets.find((a) => a.sys.id === assetId);
      
      // If not in includes, fetch directly
      if (!asset) {
        const url = await fetchContentfulAsset(assetId);
        if (url) {
          fields[key] = url;
        }
      } else if (asset?.fields?.file?.url) {
        const url = `https:${asset.fields.file.url}`;
        fields[key] = url;
      }
    }
    // Handle arrays (e.g., multiple assets)
    else if (Array.isArray(field)) {
      for (let i = 0; i < field.length; i++) {
        const item = field[i];
        if (item && typeof item === "object" && item.sys?.type === "Link" && item.sys?.linkType === "Asset") {
          const assetId = item.sys.id;
          const asset = assets.find((a) => a.sys.id === assetId);
          
          if (asset?.fields?.file?.url) {
            field[i] = `https:${asset.fields.file.url}`;
          } else {
            const url = await fetchContentfulAsset(assetId);
            if (url) field[i] = url;
          }
        }
      }
    }
  }

  return { ...entry, fields };
}

/**
 * Fetch a single asset by ID from Contentful
 * @param {string} assetId - Contentful asset ID
 * @returns {Promise<string|null>} Asset URL or null if error
 */
export async function fetchContentfulAsset(assetId) {
  if (!SPACE_ID || !ACCESS_TOKEN) return null;

  try {
    const url = `${BASE_URL}/assets/${assetId}?access_token=${ACCESS_TOKEN}`;
    const res = await fetch(url);

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    const assetUrl = data.fields?.file?.url;
    
    if (assetUrl) {
      const fullUrl = `https:${assetUrl}`;
      return fullUrl;
    }
    
    return null;
  } catch (err) {
    return null;
  }
}

/**
 * Fetch assets by search query from Contentful
 * Returns an array of resolved asset URLs
 * @param {string} query - search term (searches title/description)
 * @param {number} limit - max assets to fetch
 */
export async function fetchContentfulAssets(query = "", limit = 100) {
  if (!SPACE_ID || !ACCESS_TOKEN) return null;

  try {
    const q = query ? `&query=${encodeURIComponent(query)}` : "";
    const url = `${BASE_URL}/assets?access_token=${ACCESS_TOKEN}${q}&limit=${limit}`;
    const res = await fetch(url);

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (!data.items || data.items.length === 0) return [];

    const urls = data.items.map((asset) => {
      const assetUrl = asset.fields?.file?.url;
      if (!assetUrl) return null;
      if (assetUrl.startsWith("http")) return assetUrl;
      if (assetUrl.startsWith("//")) return `https:${assetUrl}`;
      return `https:${assetUrl}`;
    }).filter(Boolean);

    return urls;
  } catch (err) {
    return null;
  }
}

/**
 * Fetch categories from actual product entries
 * Extracts unique category values from all products in Contentful
 * @returns {Promise<Array>} Array of unique category keys (e.g., ["womensday", "spa", "birthday"])
 */
export async function fetchCategoriesFromContentful() {
  if (!SPACE_ID || !ACCESS_TOKEN) {
    return null;
  }

  try {
    // Fetch all products to get unique categories
    const url = `https://cdn.contentful.com/spaces/${SPACE_ID}/entries?content_type=product&access_token=${ACCESS_TOKEN}&limit=100`;
    const res = await fetch(url);

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    
    if (!data.items || data.items.length === 0) {
      return null;
    }

    // Extract unique categories from products
    const uniqueCategories = new Set();
    data.items.forEach((product) => {
      const category = product.fields?.category;
      if (category) {
        uniqueCategories.add(category);
      }
    });

    const categories = Array.from(uniqueCategories).sort();
    return categories;
  } catch (err) {
    return null;
  }
}

/**
 * Transform Contentful entry fields into app format
 * @param {Object} fields - Contentful entry fields
 * @param {Object} mapping - Field ID mapping (e.g., { mainTitle: "maintitle1" })
 * @returns {Object} Transformed fields
 */
export function mapFields(fields, mapping) {
  const result = {};
  Object.entries(mapping).forEach(([key, fieldId]) => {
    result[key] = fields[fieldId] || null;
  });
  return result;
}
