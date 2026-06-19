import { api, authHeaders } from "./api";

export const createBooking = async (roomId, userId, payload, token) => {
  const { data } = await api.post(`/bookings/room/${roomId}/user/${userId}`, payload, {
    headers: authHeaders(token),
  });
  return data;
};

export const getBookingByConfirmationCode = async (confirmationCode) => {
  const { data } = await api.get(`/bookings/${confirmationCode}`);
  return data.booking;
};
