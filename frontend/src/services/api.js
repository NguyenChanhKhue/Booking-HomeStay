import axiosClient from "../api/axiosClient";

export const api = axiosClient;

export const authHeaders = (token) =>
  token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
