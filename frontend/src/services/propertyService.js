import { api } from "./api";

export const getAllRooms = async () => {
  const { data } = await api.get("/rooms");
  console.log(data);
  return data.roomList ?? [];
};

export const getFeaturedRooms = async () => {
  const rooms = await getAllRooms();
  return rooms.slice(0, 8);
};

export const getRoomTypes = async () => {
  const { data } = await api.get("/rooms/types");
  return data ?? [];
};

export const searchRooms = async (filters) => {
  const params = {};

  if (filters.keyword) params.keyword = filters.keyword;
  if (filters.location) params.location = filters.location;
  if (filters.roomType) params.roomType = filters.roomType;
  if (filters.minPrice) params.minPrice = filters.minPrice;
  if (filters.maxPrice) params.maxPrice = filters.maxPrice;
  if (filters.checkInDate) params.checkInDate = filters.checkInDate;
  if (filters.checkOutDate) params.checkOutDate = filters.checkOutDate;

  const { data } = await api.get("/rooms/search", { params });
  return data.roomList ?? [];
};

export const getRoomById = async (roomId) => {
  const { data } = await api.get(`/rooms/${roomId}`);
  return data.room;
};
