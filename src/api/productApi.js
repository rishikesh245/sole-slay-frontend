import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "https://sole-slay-backend.onrender.com";

const API_URL = `${API_BASE}/api/products`;

// =========================================================
// ULTRA-FAST IN-MEMORY & SESSION STORAGE CACHE (0ms LATENCY)
// =========================================================
const memoryCache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache validity

const getCachedData = (key) => {
  // 1. Check RAM memory cache
  const item = memoryCache.get(key);
  const now = Date.now();
  if (item && now - item.timestamp < CACHE_TTL) {
    return item.data;
  }

  // 2. Check Browser SessionStorage
  try {
    const raw = sessionStorage.getItem(`ss_cache_${key}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (now - parsed.timestamp < CACHE_TTL) {
        memoryCache.set(key, parsed);
        return parsed.data;
      }
    }
  } catch {
    // Ignore storage parse issues
  }
  return null;
};

const setCachedData = (key, data) => {
  const record = { data, timestamp: Date.now() };
  memoryCache.set(key, record);
  try {
    sessionStorage.setItem(`ss_cache_${key}`, JSON.stringify(record));
  } catch {
    // Ignore storage quota limits
  }
};

export const clearProductCache = () => {
  memoryCache.clear();
  try {
    Object.keys(sessionStorage).forEach((k) => {
      if (k.startsWith("ss_cache_")) {
        sessionStorage.removeItem(k);
      }
    });
  } catch {
    // Ignore storage clearing issues
  }
};

// =========================================================
// GET ALL / FILTERED PRODUCTS (Instant Cache + Pre-warm)
// =========================================================
export const getProducts = async (
  category = "",
  subcategory = "",
  forceRefresh = false
) => {
  const cacheKey = `list_${category || "all"}_${subcategory || "all"}`;

  if (!forceRefresh) {
    const cached = getCachedData(cacheKey);
    if (cached) {
      return Promise.resolve({ data: cached });
    }
  }

  let url = API_URL;
  const params = new URLSearchParams();

  if (category && category !== "All") {
    params.append("category", category);
  }

  if (subcategory) {
    params.append("subcategory", subcategory);
  }

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const token = localStorage.getItem("token");

  const response = await axios.get(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (response.data && Array.isArray(response.data)) {
    setCachedData(cacheKey, response.data);

    // Automatically pre-warm individual product caches for instant ProductDetails opening
    response.data.forEach((p) => {
      if (p && p.id) {
        setCachedData(`item_${p.id}`, p);
      }
    });
  }

  return response;
};

// =========================================================
// GET ONE PRODUCT (0ms Instant Cache)
// =========================================================
export const getProductById = async (id, forceRefresh = false) => {
  const cacheKey = `item_${id}`;

  if (!forceRefresh) {
    const cached = getCachedData(cacheKey);
    if (cached) {
      return Promise.resolve({ data: cached });
    }
  }

  const response = await axios.get(`${API_URL}/${id}`);
  if (response.data) {
    setCachedData(cacheKey, response.data);
  }
  return response;
};

// =========================================================
// CREATE PRODUCT (Cache Invalidation)
// =========================================================
export const addProduct = async (product) => {
  clearProductCache();
  const token = localStorage.getItem("token");
  return axios.post(API_URL, product, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// =========================================================
// UPDATE PRODUCT (Cache Invalidation)
// =========================================================
export const updateProduct = async (id, product) => {
  clearProductCache();
  const token = localStorage.getItem("token");
  return axios.put(`${API_URL}/${id}`, product, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// =========================================================
// DELETE PRODUCT (Cache Invalidation)
// =========================================================
export const deleteProduct = async (id) => {
  clearProductCache();
  const token = localStorage.getItem("token");
  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
