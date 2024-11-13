import axios from "axios";
import { store } from "../store/store";
import { generateAccessToken, updateTokens } from "../pages/login/loginSlice";

// Create axios instances for protected and unprotected routes
const axiosInstanceForProtected = axios.create({
  baseURL: import.meta.env.VITE_API_BASEURL,
});

const axiosInstanceForUnProtected = axios.create({
  baseURL: import.meta.env.VITE_API_BASEURL,
});

// Request interceptor to add access token to headers
axiosInstanceForProtected.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const accessToken = state.login.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh logic
axiosInstanceForProtected.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const state = store.getState();
      const refreshToken = state.login.refreshToken;

      if (refreshToken) {
        try {
          const response = await axiosInstanceForUnProtected.post(
            "/api/auth/refresh-token",
            {
              refreshToken,
            }
          );
          store.dispatch(updateTokens(response.data));

          // Update the original request with new access token
          originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
          return axios(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }
    }
    return Promise.reject(error);
  }
);

// Function to make unprotected API calls
export const unProtectedCall = async (route, userData = "", method = "get") => {
  try {
    const response =
      method === "post"
        ? await axiosInstanceForUnProtected.post(route, userData)
        : await axiosInstanceForUnProtected.get(route);
    return response.data;
  } catch (error) {
    console.log("Error fetching data", error);
    throw error;
  }
};

// Function to make protected API calls
export const protectedCall = async (route, userData = "", method = "get") => {
  try {
    const state = store.getState();

    if (!state.login.accessToken) {
      await store.dispatch(generateAccessToken(unProtectedCall));
    }

    const response =
      method === "post"
        ? await axiosInstanceForProtected.post(route, userData)
        : await axiosInstanceForProtected.get(route);
    return response.data;
  } catch (error) {
    console.error("Error with protected call", error);
    console.log("Route", route);
    throw error;
  }
};
