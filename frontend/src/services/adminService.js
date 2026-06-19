import { api, authHeaders } from "./api";

// Room Management
export const getAllRoomsAdmin = async (token) => {
  const { data } = await api.get("/rooms", { headers: authHeaders(token) });
  return Array.isArray(data) ? data : (data.roomList ?? []);
};

export const createRoom = async (formData, token) => {
  const { data } = await api.post("/rooms", formData, {
    headers: {
      ...authHeaders(token),
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const updateRoomAdmin = async (roomId, formData, token) => {
  const { data } = await api.put(`/rooms/${roomId}`, formData, {
    headers: {
      ...authHeaders(token),
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const deleteRoomAdmin = async (roomId, token) => {
  const { data } = await api.delete(`/rooms/${roomId}`, {
    headers: authHeaders(token),
  });
  return data;
};

// Booking Management
export const getAllBookingsAdmin = async (token) => {
  const { data } = await api.get("/bookings", { headers: authHeaders(token) });
  return Array.isArray(data) ? data : (data.bookingList ?? []);
};

export const cancelBookingAdmin = async (bookingId, token) => {
  const { data } = await api.delete(`/bookings/${bookingId}`, {
    headers: authHeaders(token),
  });
  return data;
};

export const updateBookingStatusAdmin = async (bookingId, status, token) => {
  const { data } = await api.patch(`/bookings/${bookingId}/status`, { status }, {
    headers: authHeaders(token),
  });
  return data;
};

export const getBookingByConfirmationCode = async (confirmationCode, token) => {
  const { data } = await api.get(`/bookings/${confirmationCode}`, {
    headers: authHeaders(token),
  });
  return data;
};

// User Management
export const getAllUsersAdmin = async (token) => {
  const { data } = await api.get("/users", { headers: authHeaders(token) });
  return Array.isArray(data) ? data : (data.userList ?? []);
};

export const getUserById = async (userId, token) => {
  const { data } = await api.get(`/users/${userId}`, {
    headers: authHeaders(token),
  });
  return data;
};

export const deleteUserAdmin = async (userId, token) => {
  const { data } = await api.delete(`/users/${userId}`, {
    headers: authHeaders(token),
  });
  return data;
};

export const toggleUserStatusAdmin = async (userId, token) => {
  const { data } = await api.put(`/users/${userId}/toggle-status`, {}, {
    headers: authHeaders(token),
  });
  return data;
};

export const changeUserRoleAdmin = async (userId, token) => {
  const { data } = await api.put(`/users/${userId}/role`, {}, {
    headers: authHeaders(token),
  });
  return data;
};

// Dashboard Statistics
export const getDashboardStats = async (token) => {
  try {
    const bookings = await getAllBookingsAdmin(token);
    const rooms = await getAllRoomsAdmin(token);
    const users = await getAllUsersAdmin(token);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayBookings = bookings.filter((b) => {
      if (!b.createdAt) return false;
      const bookingDate = new Date(b.createdAt);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() === today.getTime();
    });

    const totalRevenue = bookings.reduce(
      (sum, b) => sum + (b.paymentStatus === "PAID" ? (b.totalPrice || 0) : 0),
      0,
    );

    return {
      totalBookings: bookings.length,
      totalRooms: rooms.length,
      totalUsers: users.length,
      todayBookings: todayBookings.length,
      totalRevenue: totalRevenue,
      bookings,
      rooms,
      users,
    };
  } catch (error) {
    console.error("Failed to load dashboard stats:", error);
    throw error;
  }
};
