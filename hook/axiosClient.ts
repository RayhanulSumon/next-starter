import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

/**
 * axiosClient - Globally configured Axios instance
 * - Sets baseURL and withCredentials
 * - Attaches token from cookie to Authorization header
 * - Handles interceptors for request/response
 */
export const axiosClient: AxiosInstance = (() => {
  // If NEXT_PUBLIC_API_URL includes /api, use it as is
  // Otherwise, append /api to ensure consistency with Laravel routes
  let baseURL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  if (!baseURL.endsWith("/api")) {
    baseURL = `${baseURL}/api`;
  }

  const instance = axios.create({
    baseURL,
    withCredentials: false, // Change to false to avoid CORS issues with wildcard origin
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Request interceptor: attach token from cookie
  instance.interceptors.request.use((config) => {
    const token = Cookies.get("token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor: handle errors globally if needed
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        Cookies.remove("token");
        if (typeof window !== "undefined") {
          window.location.href = "/loginAction"; // Redirect to loginAction on 401
        }
      }
      if (error.response?.status === 429) {
        toast.error("Too many attempts, please try again later.");
      }
      return Promise.reject(error);
    },
  );

  return instance;
})();
