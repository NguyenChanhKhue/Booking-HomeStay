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

export const getBookingHistory = async (userId, token) => {
  const { data } = await api.get(`/users/${userId}/bookings`, {
    headers: authHeaders(token),
  });
  return data;
};
