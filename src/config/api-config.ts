export const API_CONFIG = {
  BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:7271/api/v1",
  TIMEOUT: 30000, // 30 seconds
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// Debug: Log the API configuration
console.log('API Configuration:', {
  BASE_URL: API_CONFIG.BASE_URL,
  TIMEOUT: API_CONFIG.TIMEOUT,
  HEADERS: API_CONFIG.HEADERS
});
