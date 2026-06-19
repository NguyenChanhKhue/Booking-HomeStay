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
    loadStats();
  }, [token, user]);

  const getFilteredBookings = () => {
    if (!filterToday) return stats.bookings;
    const today = new Date();
    
    return stats.bookings.filter(booking => {
      if (!booking.createdAt) return false;
      // Backend returns UTC without Z, append Z to convert to local time
      const bookingDate = new Date(booking.createdAt + (booking.createdAt.endsWith('Z') ? '' : 'Z'));
      return bookingDate.getFullYear() === today.getFullYear() && 
             bookingDate.getMonth() === today.getMonth() && 
             bookingDate.getDate() === today.getDate();
    });
  };

  const displayedBookings = getFilteredBookings();

  const getTodayBookingsCount = () => {
    const today = new Date();

    return stats.bookings.reduce((count, booking) => {
      if (!booking.createdAt) return count;
      const bookingDate = new Date(booking.createdAt + (booking.createdAt.endsWith('Z') ? '' : 'Z'));
      const isToday = bookingDate.getFullYear() === today.getFullYear() && 
                      bookingDate.getMonth() === today.getMonth() && 
                      bookingDate.getDate() === today.getDate();
      return isToday ? count + 1 : count;
    }, 0);
  };

  const calculateTotalRevenue = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = today.getMonth();
    const dd = today.getDate();

    const revenue = stats.bookings.reduce((sum, booking) => {
      if (booking.status !== "CANCELLED" && booking.paymentStatus === "PAID" && booking.createdAt) {
        const bookingDate = new Date(booking.createdAt + (booking.createdAt.endsWith('Z') ? '' : 'Z'));
        
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
      return <span className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1 bg-red-100 text-red-700 rounded-full text-[11px] font-bold uppercase tracking-wider">Đã hủy</span>;
    }
    if (booking.paymentStatus === "PAID") {
      return <span className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[11px] font-bold uppercase tracking-wider">Đã thanh toán</span>;
    }
    return <span className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-[11px] font-bold uppercase tracking-wider">Chưa thanh toán</span>;
  };

  const StatCard = ({ icon: Icon, label, value, color, onClick }) => (
    <div 
      className={`bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-between cursor-pointer hover:-translate-y-1 transition-all duration-300`}
      style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
      onClick={onClick}
    >
      <div className="flex-1 pr-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 whitespace-nowrap">{label}</p>
        <div className="text-3xl font-black text-gray-900">{value}</div>
      </div>
      <div
        className="p-3 rounded-2xl flex-shrink-0"
        style={{ backgroundColor: `${color}15`, color: color }}
      >
        <Icon size={24} />
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tổng quan</h1>
        <p className="text-sm text-gray-500 mt-1">
          Xin chào, {user?.name ?? "Admin"}! Đây là thống kê hôm nay.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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
          onClick={() => {
            setFilterToday(true);
            document.getElementById('recent-bookings')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </div>

      {/* Revenue Section */}
      <div 
        className="bg-white rounded-2xl border border-gray-100 p-6"
        style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Tổng doanh thu</h2>
          <select 
            value={revenueFilter}
            onChange={(e) => setRevenueFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-rose-500 font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition"
          >
            <option value="all">Toàn thời gian</option>
            <option value="day">Hôm nay</option>
            <option value="month">Tháng này</option>
            <option value="year">Năm nay</option>
          </select>
        </div>
        <p className="text-4xl font-black text-[#333333] tracking-tight">
          {calculateTotalRevenue()}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Doanh thu từ tất cả các đơn đặt đã được thanh toán thành công.
        </p>
      </div>

      {/* Recent Bookings */}
      <div 
        id="recent-bookings" 
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
      >
        <div className="border-b border-gray-100 px-6 py-5 flex justify-between items-center bg-white">
          <h2 className="text-2xl font-bold text-gray-900">
            {filterToday ? "Đơn đặt hôm nay" : "Đơn đặt gần đây"}
          </h2>
          {filterToday && (
            <button
              onClick={() => setFilterToday(false)}
              className="px-5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl text-sm transition-colors"
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
                  <td className="px-6 py-4 text-sm text-gray-900 font-bold whitespace-nowrap">
                    {new Intl.NumberFormat('vi-VN').format(booking.totalPrice || 0)} đ
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    {getStatusBadge(booking)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
                      >
                        Chi tiết
                      </button>
                      {booking.status !== "CANCELLED" && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
                        >
                          Hủy
                        </button>
                      )}
                    </div>
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
                <span className="text-rose-600 font-bold text-base">
                  {new Intl.NumberFormat('vi-VN').format(selectedBooking.totalPrice || 0)} đ
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-gray-500 font-medium">Thời gian:</span>
                <span className="col-span-2 text-gray-900 font-semibold">
                  {new Date(selectedBooking.checkInDate).toLocaleDateString("vi-VN")} - {new Date(selectedBooking.checkOutDate).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-gray-500 font-medium">Số người:</span>
                <span className="col-span-2 text-gray-900 font-semibold">{selectedBooking.numberOfGuests || 1}</span>
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
