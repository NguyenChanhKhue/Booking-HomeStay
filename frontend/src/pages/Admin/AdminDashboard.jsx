import { BarChart3, BookOpen, Home, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDashboardStats } from "../../services/adminService";
import { formatPrice } from "../../utils/formatPrice";

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

    loadStats();
  }, [token, user]);

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div
      className="bg-white rounded-lg shadow-md p-6 border-l-4"
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
        />
        <StatCard
          icon={Home}
          label="Tổng phòng"
          value={stats.totalRooms}
          color="#10B981"
        />
        <StatCard
          icon={Users}
          label="Tổng người dùng"
          value={stats.totalUsers}
          color="#8B5CF6"
        />
        <StatCard
          icon={BarChart3}
          label="Đơn hôm nay"
          value={stats.todayBookings}
          color="#F59E0B"
        />
      </div>

      {/* Revenue Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tổng doanh thu</h2>
        <p className="text-4xl font-bold text-rose-500">
          {formatPrice(stats.totalRevenue)}
        </p>
        <p className="text-gray-600 text-sm mt-2">
          Doanh thu từ tất cả các đơn đặt
        </p>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900">Đơn đặt gần đây</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
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
                  Số khách
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.bookings.slice(0, 5).map((booking) => (
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
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {booking.totalNumberOfGuest}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {stats.bookings.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            Chưa có đơn đặt nào
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
