import { CalendarDays, KeyRound, Phone, Edit2, User as UserIcon, Camera } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { formatPrice } from "../../utils/formatPrice";
import { api, authHeaders } from "../../services/api";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, user, fetchBookingHistory, updateProfile, token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // Edit Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: "", phoneNumber: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

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
        const sortedList = [...list].sort((a, b) => b.id - a.id);
        setBookings(sortedList);
      } catch (err) {
        setError("Không thể tải lịch sử đặt phòng.");
      }
    };

    loadHistory();
  }, [fetchBookingHistory, isAuthenticated]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn đặt phòng này?")) return;
    try {
      await api.delete(`/bookings/${bookingId}`, {
        headers: authHeaders(token),
      });
      alert("Hủy đơn đặt phòng thành công!");
      const list = await fetchBookingHistory();
      const sortedList = [...list].sort((a, b) => b.id - a.id);
      setBookings(sortedList);
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      alert("Không thể hủy đơn đặt phòng.");
    }
  };

  const handlePayNow = async (bookingId) => {
    try {
      const { data } = await api.get(`/payment/create-url/${bookingId}`);
      if (data && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert("Không thể tạo đường dẫn thanh toán lúc này.");
      }
    } catch (err) {
      alert("Lỗi kết nối đến cổng thanh toán.");
    }
  };

  const handleEditClick = () => {
    setEditFormData({ name: user?.name || "", phoneNumber: user?.phoneNumber || "" });
    setAvatarPreview(user?.avatarUrl || null);
    setAvatarFile(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setAvatarPreview(user?.avatarUrl || null);
    setAvatarFile(null);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", editFormData.name);
      formData.append("phoneNumber", editFormData.phoneNumber);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      await updateProfile(formData);
      alert("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (err) {
      alert("Cập nhật thông tin thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-500">
            Tài khoản của bạn
          </p>
          {!isEditing && (
            <button 
              onClick={handleEditClick}
              className="flex items-center gap-2 text-sm font-medium text-rose-500 hover:bg-rose-50 px-3 py-1.5 rounded-full transition"
            >
              <Edit2 size={16} /> Chỉnh sửa
            </button>
          )}
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="mt-4 bg-gray-50 p-6 rounded-[28px] border border-gray-100">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center gap-4">
                <div 
                  className="relative w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200 cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                      <UserIcon size={48} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={24} />
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <p className="text-xs text-gray-500">Nhấn vào ảnh để thay đổi</p>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                  <input 
                    type="text" 
                    value={editFormData.name} 
                    onChange={e => setEditFormData({...editFormData, name: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input 
                    type="text" 
                    value={editFormData.phoneNumber} 
                    onChange={e => setEditFormData({...editFormData, phoneNumber: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (Không thể thay đổi)</label>
                  <input 
                    type="text" 
                    value={user?.email} 
                    disabled
                    className="w-full px-4 py-2 border border-gray-200 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-rose-500 text-white font-medium rounded-full hover:bg-rose-600 transition disabled:opacity-70"
                  >
                    {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                  <button 
                    type="button" 
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="mt-4 grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[28px] bg-gray-50 p-6 flex items-center gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-sm shrink-0 bg-gray-200">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <UserIcon size={32} />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-gray-950">
                  {user?.name}
                </h1>
                <p className="mt-2 text-gray-600">{user?.email}</p>
                <div className="mt-3 flex items-center gap-3 text-sm text-gray-600">
                  <Phone size={16} className="text-rose-500" />
                  <span>{user?.phoneNumber || "Chưa cập nhật số điện thoại"}</span>
                </div>
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
        )}
      </section>

      <section className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
              Lịch sử đặt phòng
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950">
              Những booking bạn đã thực hiện
            </h2>
          </div>
          <form 
            className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto mt-4 md:mt-0"
            onSubmit={(e) => {
              e.preventDefault();
              const found = bookings.find(b => b.bookingConfirmationCode?.toLowerCase() === searchQuery.trim().toLowerCase());
              if (found && found.room?.id) {
                navigate(`/rooms/${found.room.id}`);
              } else {
                alert("Không tìm thấy mã đặt phòng này trong lịch sử của bạn.");
              }
            }}
          >
            <div className="flex w-full sm:w-auto gap-2">
              <input 
                type="text" 
                placeholder="Nhập mã đặt phòng..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm outline-none transition focus:border-rose-300 w-full sm:w-48"
              />
              <button type="submit" className="shrink-0 rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600">
                Đến phòng
              </button>
            </div>
          </form>
        </div>

        {error ? (
          <div className="mt-6 rounded-[20px] border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        ) : null}

        {bookings.length > 0 ? (
          <div className="mt-8 space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="flex flex-col gap-2">
                <div className="grid gap-5 rounded-[28px] border border-gray-100 p-5 lg:grid-cols-[1.1fr_0.9fr]">
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
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${booking.status === "CANCELLED" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                          {booking.status === "CANCELLED" ? "Đã hủy" : "Thành công"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${booking.paymentStatus === "PAID" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>
                          {booking.paymentStatus === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[24px] bg-gray-50 p-5 flex flex-col justify-end">
                    <div className="space-y-2 mt-4">
                      <button
                        onClick={() => setSelectedBooking(selectedBooking?.id === booking.id ? null : booking)}
                        className="w-full rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-500 transition hover:bg-rose-50"
                      >
                        {selectedBooking?.id === booking.id ? "Ẩn chi tiết" : "Xem chi tiết"}
                      </button>
                      {booking.status !== "CANCELLED" && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="w-full rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                        >
                          Hủy đơn
                        </button>
                      )}
                      {booking.status !== "CANCELLED" && booking.paymentStatus !== "PAID" && (
                        <button
                          onClick={() => handlePayNow(booking.id)}
                          className="w-full rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                        >
                          Thanh toán ngay
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                {/* Detailed view rendered below the booking card if selected */}
                {selectedBooking?.id === booking.id && (
                  <div className="p-6 bg-rose-50/50 rounded-[28px] border border-rose-100">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Thông tin chi tiết đơn đặt
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <p>
                        <strong className="text-gray-800">Tên khách:</strong>{" "}
                        {user?.name}
                      </p>
                      <p>
                        <strong className="text-gray-800">Email:</strong>{" "}
                        {user?.email}
                      </p>
                      <p>
                        <strong className="text-gray-800">Loại phòng:</strong>{" "}
                        {booking.room?.roomType || "N/A"}
                      </p>
                      <p>
                        <strong className="text-gray-800">Giá mỗi đêm:</strong>{" "}
                        {formatPrice(booking.room?.roomPrice)}
                      </p>
                      <p>
                        <strong className="text-gray-800">Số đêm ở:</strong>{" "}
                        {Math.max(1, Math.ceil((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24)))} đêm
                      </p>
                      <p>
                        <strong className="text-gray-800">Tổng tiền:</strong>{" "}
                        <span className="text-rose-600 font-bold text-base">
                          {formatPrice((booking.room?.roomPrice || 0) * Math.max(1, Math.ceil((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24))))}
                        </span>
                      </p>
                      <p className="md:col-span-2">
                        <strong className="text-gray-800">Mã đặt phòng:</strong>{" "}
                        <span className="bg-white px-2 py-1 rounded border border-gray-200 ml-1 font-mono text-xs">{booking.bookingConfirmationCode}</span>
                      </p>
                    </div>
                  </div>
                )}
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
