import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  getBookingHistory,
  getMyInfo,
  loginRequest,
  registerRequest,
  updateProfileRequest,
} from "../services/authService";

const AuthContext = createContext(null);

const TOKEN_KEY = "booking_home_stay_token";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const profile = await getMyInfo(token);
        setUser(profile);
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [token]);

  const persistSession = useCallback(async (nextToken) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);
    const profile = await getMyInfo(nextToken);
    setUser(profile);
    return profile;
  }, []);

  const login = useCallback(async (payload) => {
    const response = await loginRequest(payload);
    await persistSession(response.token);
    return response;
  }, [persistSession]);

  const register = useCallback(async (payload) => {
    const response = await registerRequest(payload);
    await persistSession(response.token);
    return response;
  }, [persistSession]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!token) return null;
    const profile = await getMyInfo(token);
    setUser(profile);
    return profile;
  }, [token]);

  const updateProfile = useCallback(async (formData) => {
    if (!token) return null;
    const response = await updateProfileRequest(formData, token);
    if (response && response.user) {
      setUser(response.user);
    }
    return response;
  }, [token]);

  const fetchBookingHistory = useCallback(async () => {
    if (!token || !user?.id) return [];
    const data = await getBookingHistory(user.id, token);
    const nextUser = data.user ?? user;
    setUser(nextUser);
    return data.bookingList ?? nextUser.bookings ?? [];
  }, [token, user]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: Boolean(token),
        login,
        register,
        logout,
        refreshProfile,
        updateProfile,
        fetchBookingHistory,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
