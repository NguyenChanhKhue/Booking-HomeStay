import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createBooking } from "../../services/bookingService";
import { getRoomById } from "../../services/propertyService";
import { formatPrice } from "../../utils/formatPrice";

const BookingPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    isAuthenticated,
    loading: authLoading,
    user,
    refreshProfile,
  } = useAuth();
  const [room, setRoom] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    checkInDate: searchParams.get("checkInDate") ?? "",
    checkOutDate: searchParams.get("checkOutDate") ?? "",
    numOfAdults: 1,
    numOfChildren: 0,
  });

  useEffect(() => {
    const loadRoom = async () => {
      try {
        const data = await getRoomById(roomId);
        setRoom(data);
      } catch (err) {
        setError("Không thể tải thông tin phòng để đặt.");
      }
    };

    loadRoom();
  }, [roomId]);

  const bookingPayload = useMemo(
    () => ({
      checkInDate: form.checkInDate,
      checkOutDate: form.checkOutDate,
      numOfAdults: Number(form.numOfAdults),
      numOfChildren: Number(form.numOfChildren),
    }),
    [form],
  );

  const getDiffDays = () => {
    if (!form.checkInDate || !form.checkOutDate) return 1;
    const checkIn = new Date(form.checkInDate);
    const checkOut = new Date(form.checkOutDate);
    if (checkOut <= checkIn) return 1;
    const diffTime = Math.abs(checkOut - checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      if (!isAuthenticated) {
        navigate(
          `/auth?redirect=${encodeURIComponent(`/rooms/${roomId}/booking`)}`,
        );
        return;
      }

      const profile = user ?? (await refreshProfile());
      const response = await createBooking(roomId, profile.id, bookingPayload);
      setMessage(
        `Đặt phòng thành công. Mã xác nhận của bạn là ${response.bookingConfirmationCode}.`,
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Đặt phòng thất bại. Vui lòng thử lại.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading && !isAuthenticated) {
    return (
      <div className="rounded-[28px] border border-dashed border-gray-200 p-12 text-center text-gray-500">
        Đang kiểm tra phiên đăng nhập...
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
      <section className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-500">
          Hoàn tất đặt phòng
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gray-950">
          Điền thông tin lưu trú của bạn
        </h1>

        {!isAuthenticated ? (
          <div className="mt-6 rounded-[24px] border border-amber-200 bg-amber-50 p-5 text-sm text-amber-700">
            Bạn cần đăng nhập trước khi đặt phòng.
            <Link
              to={`/auth?redirect=${encodeURIComponent(`/rooms/${roomId}/booking`)}`}
              className="ml-2 font-semibold text-amber-900 underline"
            >
              Đi tới đăng nhập
            </Link>
          </div>
        ) : null}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Ngày nhận phòng
              </span>
              <input
                type="date"
                name="checkInDate"
                value={form.checkInDate}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-300"
                required
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Ngày trả phòng
              </span>
              <input
                type="date"
                name="checkOutDate"
                value={form.checkOutDate}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-300"
                required
              />
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Người lớn
              </span>
              <input
                type="number"
                min="1"
                name="numOfAdults"
                value={form.numOfAdults}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-300"
                required
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Trẻ em
              </span>
              <input
                type="number"
                min="0"
                name="numOfChildren"
                value={form.numOfChildren}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-300"
                required
              />
            </label>
          </div>

          <div className="rounded-[24px] bg-rose-50 p-5 mt-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-rose-500 mb-4">
              Chi tiết thanh toán
            </h3>
            <div className="flex justify-between text-gray-700 font-medium">
              <span>Giá mỗi đêm:</span>
              <span>{formatPrice(room?.roomPrice)}</span>
            </div>
            <div className="flex justify-between text-gray-700 font-medium mt-2">
              <span>Số đêm ở:</span>
              <span>{getDiffDays()} đêm</span>
            </div>
            <div className="flex justify-between border-t border-rose-200 mt-4 pt-4 text-xl font-bold text-rose-600">
              <span>Tổng tiền:</span>
              <span>{formatPrice((room?.roomPrice || 0) * getDiffDays())}</span>
            </div>
          </div>

          {message ? (
            <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              {message}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-[20px] border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-full bg-rose-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Đang gửi yêu cầu..." : "Xác nhận đặt phòng"}
          </button>
        </form>
      </section>

      <aside className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
          Thông tin phòng
        </p>
        {room ? (
          <div className="mt-5 space-y-5">
            <div className="overflow-hidden rounded-[28px] bg-gray-100">
              <img
                src={
                  room.roomPhotoUrl ||
                  "https://via.placeholder.com/900x600?text=Room"
                }
                alt={room.roomType}
                className="h-60 w-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-950">
                {room.roomType}
              </h2>
              <p className="mt-2 text-sm leading-7 text-gray-600">
                {room.roomDescription}
              </p>
            </div>
            <div className="rounded-[24px] bg-gray-50 p-5">
              <p className="text-sm text-gray-500">Giá mỗi đêm</p>
              <p className="mt-2 text-3xl font-semibold text-gray-950">
                {formatPrice(room.roomPrice)}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-5 text-gray-500">Đang tải dữ liệu phòng...</p>
        )}
      </aside>
    </div>
  );
};

export default BookingPage;
