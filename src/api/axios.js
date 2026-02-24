import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// ── REQUEST ──────────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    try {
      const stored = localStorage.getItem("auth");
      if (stored) {
        const token = JSON.parse(stored)?.token; // 👈 "token" no "accessToken"
        if (token) config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {}
    return config;
  },
  (error) => Promise.reject(error),
);

// ── RESPONSE ─────────────────────────────────────────────────────────
let isRefreshing = false;
let pendingQueue = [];

const processPendingQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token),
  );
  pendingQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config;
    const url = original?.url ?? "";
    const esLoginORefresh =
      url.includes("/auth/login") || url.includes("/auth/refresh");

    if (
      error.response?.status === 401 &&
      !original._retry &&
      !esLoginORefresh
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            return api(original);
          })
          .catch((e) => Promise.reject(e));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { useAuthStore } = await import("@/stores/auth");
        const auth = useAuthStore();
        const newToken = await auth.refreshAccessToken();

        if (!newToken) throw new Error("Refresh falló");

        processPendingQueue(null, newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (refreshError) {
        processPendingQueue(refreshError, null);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
