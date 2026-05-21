import { CalendarDays, KeyRound, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { formatPrice } from "../../utils/formatPrice";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, user, fetchBookingHistory } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth?redirect=%2Fprofile");
      return;
    }
    if (!loading && isAuthenticated && user?.role === "ADMIN") {
      navigate("/admin");
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    const loadHistory = async () => {
      if (!isAuthenticated) return;

      try {
        const list = await fetchBookingHistory();
        setBookings(list);
      } catch (err) {
        setError("Không thể tải lịch sử đặt phòng.");
      }
    };

    loadHistory();
  }, [fetchBookingHistory, isAuthenticated]);

  if (loading) {
    return (
      <div className="rounded-[28px] border border-dashed border-gray-200 p-12 text-center text-gray-500">
        Đang tải hồ sơ cá nhân...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-500">
          Tài khoản của bạn
        </p>
        <div className="mt-4 grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[28px] bg-gray-50 p-6">
            <h1 className="text-3xl font-semibold text-gray-950">
              {user?.name}
            </h1>
            <p className="mt-2 text-gray-600">{user?.email}</p>
            <div className="mt-5 flex items-center gap-3 text-sm text-gray-600">
              <Phone size={16} className="text-rose-500" />
              <span>{user?.phoneNumber || "Chưa cập nhật số điện thoại"}</span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[28px] border border-gray-100 p-6">
              <p className="text-sm text-gray-500">Vai trò</p>
              <p className="mt-2 text-2xl font-semibold text-gray-950">
                {user?.role}
              </p>
            </div>
            <div className="rounded-[28px] border border-gray-100 p-6">
              <p className="text-sm text-gray-500">Số booking</p>
              <p className="mt-2 text-2xl font-semibold text-gray-950">
                {bookings.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
              Lịch sử đặt phòng
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950">
              Những booking bạn đã thực hiện
            </h2>
          </div>
          <Link to="/search" className="text-sm font-medium text-rose-500">
            Tìm thêm chỗ ở
          </Link>
        </div>

        {error ? (
          <div className="mt-6 rounded-[20px] border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        ) : null}

        {bookings.length > 0 ? (
          <div className="mt-8 space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="grid gap-5 rounded-[28px] border border-gray-100 p-5 lg:grid-cols-[1.1fr_0.9fr]"
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-950">
                    {booking.room?.roomType || "Phòng đã đặt"}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-gray-600">
                    {booking.room?.roomDescription ||
                      "Chi tiết phòng được lấy từ lịch sử booking."}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} className="text-rose-500" />
                      <span>
                        {booking.checkInDate} đến {booking.checkOutDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <KeyRound size={16} className="text-rose-500" />
                      <span>Mã: {booking.bookingConfirmationCode}</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-[24px] bg-gray-50 p-5">
                  <p className="text-sm text-gray-500">Tổng số khách</p>
                  <p className="mt-2 text-2xl font-semibold text-gray-950">
                    {booking.totalNumOfGuest}
                  </p>
                  <p className="mt-3 text-sm text-gray-500">
                    Giá tham khảo mỗi đêm
                  </p>
                  <p className="mt-2 text-xl font-semibold text-gray-950">
                    {formatPrice(booking.room?.roomPrice)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[28px] border border-dashed border-gray-200 p-12 text-center text-gray-500">
            Bạn chưa có booking nào. Hãy chọn một căn phòng và bắt đầu chuyến đi
            đầu tiên.
          </div>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;
