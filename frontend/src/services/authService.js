import { api, authHeaders } from "./api";

export const loginRequest = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

export const registerRequest = async (payload) => {
  const body = {
    ...payload,
    role: "CUSTOMER",
  };
  const { data } = await api.post("/auth/register", body);
  return data;
};

export const getMyInfo = async (token) => {
  const { data } = await api.get("/users/me", {
    headers: authHeaders(token),
  });
  return data.user;
};

export const updateProfileRequest = async (formData, token) => {
  const { data } = await api.put("/users/profile", formData, {
    headers: {
      ...authHeaders(token),
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const getBookingHistory = async (userId, token) => {
  const { data } = await api.get(`/users/${userId}/bookings`, {
    headers: authHeaders(token),
  });
  return data;
};

export const requestPasswordReset = async (email) => {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
};

export const resetPassword = async (email, otp, newPassword) => {
  const { data } = await api.post("/auth/reset-password", {
    email,
    otp,
    newPassword,
  });
  return data;
};
