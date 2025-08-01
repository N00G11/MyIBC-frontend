import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api", // ✅ dynamique
  withCredentials: true,
});

// Ajouter automatiquement le token à chaque requête
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    // Liste des endpoints publics (à adapter à ton cas)
    const publicEndpoints = ['/auth/login', '/auth/register', '/public'];

    // Vérifie que config.url existe avant d'utiliser startsWith
    const url = config.url || '';
    const isPublic = publicEndpoints.some((publicUrl) => url.startsWith(publicUrl));

    if (token && !isPublic) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;