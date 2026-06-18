import { BarChart3, BookOpen, Home, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDashboardStats, updateBookingStatusAdmin } from "../../services/adminService";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, token } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRooms: 0,
    totalUsers: 0,
    todayBookings: 0,
    totalRevenue: 0,
    bookings: [],
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [filterToday, setFilterToday] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [revenueFilter, setRevenueFilter] = useState('all');

  const calculatePrice = (booking) => {
    const pricePerNight = booking.room?.roomPrice || 0;
    if (booking.checkInDate && booking.checkOutDate) {
      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);
      const diffTime = Math.abs(checkOut - checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const days = diffDays > 0 ? diffDays : 1;
      return pricePerNight * days;
    }
    return pricePerNight;
  };

  const loadStats = async () => {
    if (!token || user?.role !== "ADMIN") return;
    try {
      const data = await getDashboardStats(token);
      setStats(data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth?redirect=%2Fadmin");
      return;
    }

    if (!loading && user?.role !== "ADMIN") {
      navigate("/");
      return;
    }
  }, [isAuthenticated, loading, user, navigate]);

  useEffect(() => {
    loadStats();
  }, [token, user]);

  const getFilteredBookings = () => {
    if (!filterToday) return stats.bookings;
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const currentDateStr = `${yyyy}-${mm}-${dd}`;
    
    return stats.bookings.filter(booking => {
      if (!booking.createdAt) return false;
      return booking.createdAt.split("T")[0] === currentDateStr;
    });
  };

  const displayedBookings = getFilteredBookings();

  const getTodayBookingsCount = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const currentDateStr = `${yyyy}-${mm}-${dd}`;

    return stats.bookings.reduce((count, booking) => {
      if (!booking.createdAt) return count;
      const bookingDateStr = booking.createdAt.split("T")[0];
      return bookingDateStr === currentDateStr ? count + 1 : count;
    }, 0);
  };

  const calculateTotalRevenue = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = today.getMonth();
    const dd = today.getDate();

    const revenue = stats.bookings.reduce((sum, booking) => {
      if (booking.status !== "CANCELLED" && booking.paymentStatus === "PAID" && booking.createdAt) {
        const bookingDate = new Date(booking.createdAt);
        
        if (revenueFilter === 'day') {
          if (bookingDate.getFullYear() !== yyyy || bookingDate.getMonth() !== mm || bookingDate.getDate() !== dd) {
            return sum;
          }
        } else if (revenueFilter === 'month') {
          if (bookingDate.getFullYear() !== yyyy || bookingDate.getMonth() !== mm) {
            return sum;
          }
        } else if (revenueFilter === 'year') {
          if (bookingDate.getFullYear() !== yyyy) {
            return sum;
          }
        }

        if (booking.totalPrice) {
          return sum + booking.totalPrice;
        }

        const pricePerNight = booking.room?.roomPrice || 0;
        if (booking.checkInDate && booking.checkOutDate) {
          const checkIn = new Date(booking.checkInDate);
          const checkOut = new Date(booking.checkOutDate);
          const diffTime = Math.abs(checkOut - checkIn);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const days = diffDays > 0 ? diffDays : 1;
          return sum + (pricePerNight * days);
        }
        return sum + pricePerNight;
      }
      return sum;
    }, 0);

    const formatted = new Intl.NumberFormat("vi-VN").format(revenue);
    return `${formatted} đ`;
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn đặt phòng này?")) return;
    try {
      await updateBookingStatusAdmin(bookingId, "CANCELLED", token);
      alert("Hủy đơn đặt phòng thành công!");
      await loadStats();
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      alert("Không thể hủy đơn đặt phòng.");
    }
  };

  const getStatusBadge = (booking) => {
    if (booking.status === "CANCELLED") {
      return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold uppercase tracking-wider">Đã hủy</span>;
    }
    if (booking.paymentStatus === "PAID") {
      return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold uppercase tracking-wider">Đã thanh toán</span>;
    }
    return <span className="px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold uppercase tracking-wider">Chưa thanh toán</span>;
  };

  const StatCard = ({ icon: Icon, label, value, color, onClick }) => (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${onClick ? 'cursor-pointer hover:scale-105 transition-transform duration-300' : ''}`}
      style={{ borderColor: color }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div
          className="p-3 rounded-full"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={28} color={color} />
        </div>
      </div>
    </div>
  );

  if (loading || loadingStats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Tổng quan</h1>
        <p className="text-gray-600 mt-2">
          Xin chào, {user?.name ?? "Admin"}! Đây là thống kê hôm nay.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={BookOpen}
          label="Tổng đơn đặt"
          value={stats.totalBookings}
          color="#3B82F6"
          onClick={() => navigate("/admin/bookings")}
        />
        <StatCard
          icon={Home}
          label="Tổng phòng"
          value={stats.totalRooms}
          color="#10B981"
          onClick={() => navigate("/admin/properties")}
        />
        <StatCard
          icon={Users}
          label="Tổng người dùng"
          value={stats.totalUsers}
          color="#8B5CF6"
          onClick={() => navigate("/admin/users")}
        />
        <StatCard
          icon={BarChart3}
          label="Đơn hôm nay"
          value={getTodayBookingsCount()}
          color="#F59E0B"
          onClick={() => setFilterToday(true)}
        />
      </div>

      {/* Revenue Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Tổng doanh thu</h2>
          <select 
            value={revenueFilter}
            onChange={(e) => setRevenueFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-rose-500 font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition"
          >
            <option value="all">Toàn thời gian</option>
            <option value="day">Hôm nay</option>
            <option value="month">Tháng này</option>
            <option value="year">Năm nay</option>
          </select>
        </div>
        <p className="text-4xl font-bold text-rose-500">
          {calculateTotalRevenue()}
        </p>
        <p className="text-gray-600 text-sm mt-2">
          Doanh thu từ tất cả các đơn đặt đã được thanh toán thành công.
        </p>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {filterToday ? "Đơn đặt hôm nay" : "Đơn đặt gần đây"}
          </h2>
          {filterToday && (
            <button
              onClick={() => setFilterToday(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg text-sm transition"
            >
              Xem tất cả
            </button>
          )}
        </div>
        <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Mã xác nhận
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Ngày nhận
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Ngày trả
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayedBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {booking.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {booking.bookingConfirmationCode}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(booking.checkInDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(booking.checkOutDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 text-sm text-rose-500 font-semibold">
                    {new Intl.NumberFormat('vi-VN').format(calculatePrice(booking))} đ
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {getStatusBadge(booking)}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                    >
                      Xem chi tiết
                    </button>
                    {booking.status !== "CANCELLED" && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                      >
                        Hủy
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {displayedBookings.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            {filterToday ? "Không có đơn đặt hôm nay" : "Chưa có đơn đặt nào"}
          </div>
        )}
      </div>
      {/* Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 transition-all">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Chi tiết đơn đặt</h3>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-600 transition text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-gray-500 font-medium">Tên khách:</span>
                <span className="col-span-2 text-gray-900 font-semibold">{selectedBooking.user?.name || "N/A"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-gray-500 font-medium">Email:</span>
                <span className="col-span-2 text-gray-900 font-semibold">{selectedBooking.user?.email || "N/A"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-gray-500 font-medium">Loại phòng:</span>
                <span className="col-span-2 text-gray-900 font-semibold">{selectedBooking.room?.roomType || "N/A"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-gray-500 font-medium">Giá phòng:</span>
                <span className="col-span-2 text-gray-900 font-semibold">{selectedBooking.room?.roomPrice ? new Intl.NumberFormat('vi-VN').format(selectedBooking.room.roomPrice) + ' đ/đêm' : "N/A"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-gray-500 font-medium">Tổng tiền:</span>
                <span className="col-span-2 text-rose-500 font-bold text-lg">{new Intl.NumberFormat('vi-VN').format(calculatePrice(selectedBooking))} đ</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-gray-500 font-medium">Thời gian:</span>
                <span className="col-span-2 text-gray-900 font-semibold">
                  {new Date(selectedBooking.checkInDate).toLocaleDateString("vi-VN")} - {new Date(selectedBooking.checkOutDate).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-gray-500 font-medium">Số người:</span>
                <span className="col-span-2 text-gray-900 font-semibold">{selectedBooking.totalNumberOfGuest || selectedBooking.totalNumOfGuest || 1}</span>
              </div>
            </div>
            <div className="p-6 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
