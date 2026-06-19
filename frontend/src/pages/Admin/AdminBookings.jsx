import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  cancelBookingAdmin,
  getAllBookingsAdmin,
} from "../../services/adminService";

const AdminBookings = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");



  useEffect(() => {
    const loadBookings = async () => {
      if (!token || user?.role !== "ADMIN") return;
      try {
        const data = await getAllBookingsAdmin(token);
        setBookings(data);
      } catch (error) {
        console.error("Failed to load bookings:", error);
        setMessage("Không thể tải danh sách đơn đặt");
      } finally {
        setLoadingBookings(false);
      }
    };

    loadBookings();
  }, [token, user]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Bạn có chắc muốn hủy đơn đặt này?")) return;

    try {
      await cancelBookingAdmin(bookingId, token);
      setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status: "CANCELLED" } : b));
      setMessage("Hủy đơn đặt thành công!");
      setSelectedBooking(null);
    } catch (error) {
      setMessage(error.response?.data?.message || "Không thể hủy đơn đặt");
    }
  };

  const getStatusBadge = (booking) => {
    if (booking.status === "CANCELLED") {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
          Đã hủy
        </span>
      );
    }
    const checkOutDate = new Date(booking.checkOutDate);
    const today = new Date();

    if (checkOutDate < today) {
      return (
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
          Đã hoàn thành
        </span>
      );
    }

    return (
      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
        Đang diễn ra
      </span>
    );
  };

  const filteredBookings = bookings.filter((booking) => {
    if (!searchQuery) return true;
    return booking.bookingConfirmationCode?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading || loadingBookings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Quản lý đơn đặt</h1>
          <p className="text-gray-600 mt-2">
            Tổng cộng {filteredBookings.length} đơn đặt
          </p>
        </div>
        <div className="w-full md:w-auto">
          <input
            type="text"
            placeholder="Tìm theo mã đơn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`px-6 py-4 rounded-lg ${
            message.includes("Không thể") || message.includes("lỗi")
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Bookings Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredBookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <div className="border-l-4 border-rose-500">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        {booking.room?.roomType || "Phòng"}
                      </h3>
                      <div className="flex gap-2">
                        {getStatusBadge(booking)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${booking.paymentStatus === "PAID" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>
                          {booking.paymentStatus === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-gray-600 text-sm">Mã xác nhận</p>
                        <p className="font-semibold text-gray-900">
                          {booking.bookingConfirmationCode}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Ngày nhận</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(booking.checkInDate).toLocaleDateString(
                            "vi-VN",
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Ngày trả</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(booking.checkOutDate).toLocaleDateString(
                            "vi-VN",
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Số khách</p>
                        <p className="font-semibold text-gray-900">
                          {booking.totalNumberOfGuest}
                        </p>
                      </div>
                    </div>

                    <div className="text-gray-600 text-sm">
                      <p>Địa điểm: {booking.room?.roomLocation || "N/A"}</p>
                      <p>Khách: {booking.user?.name || "N/A"}</p>
                    </div>
                  </div>

                  {booking.status !== "CANCELLED" && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Hủy đơn đặt"
                    >
                      <X size={24} />
                    </button>
                  )}
                </div>

                <button
                  onClick={() =>
                    setSelectedBooking(
                      selectedBooking?.id === booking.id ? null : booking,
                    )
                  }
                  className="mt-4 text-rose-500 hover:text-rose-600 text-sm font-medium"
                >
                  {selectedBooking?.id === booking.id
                    ? "Ẩn chi tiết"
                    : "Xem chi tiết"}
                </button>

                {selectedBooking?.id === booking.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Thông tin chi tiết
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        <strong>Tên khách:</strong>{" "}
                        {booking.user?.name || "N/A"}
                      </p>
                      <p>
                        <strong>Email:</strong> {booking.user?.email || "N/A"}
                      </p>
                      <p>
                        <strong>Loại phòng:</strong>{" "}
                        {booking.room?.roomType || "N/A"}
                      </p>
                      <p>
                        <strong>Giá phòng:</strong>{" "}
                        {booking.room?.roomPrice || 0} VND
                      </p>
                      <p>
                        <strong>Ghi chú:</strong>{" "}
                        {booking.specialRequests || "Không có"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
          <p className="text-lg">Không tìm thấy đơn đặt nào</p>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
