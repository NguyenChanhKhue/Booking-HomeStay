import { api } from "./api";

export const createBooking = async (roomId, userId, payload) => {
  const { data } = await api.post(`/bookings/room/${roomId}/user/${userId}`, payload);
  return data;
};

export const getBookingByConfirmationCode = async (confirmationCode) => {
  const { data } = await api.get(`/bookings/${confirmationCode}`);
  return data.booking;
};
