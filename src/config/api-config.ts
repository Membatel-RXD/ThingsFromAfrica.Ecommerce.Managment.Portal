export const API_CONFIG = {
  BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "https://localhost:7271/api/v1",
  TIMEOUT: 30000, // 30 seconds
  HEADERS: {
    Accept: "application/json",
  },
};
