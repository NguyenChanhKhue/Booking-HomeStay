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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookingPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    isAuthenticated,
    loading: authLoading,
    user,
    token,
    refreshProfile,
  } = useAuth();
  const [room, setRoom] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("VNPAY");
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

  const disabledIntervals = useMemo(() => {
    if (!room || !room.bookings) return [];
    return room.bookings
      .filter((b) => b.status !== "CANCELLED")
      .map((b) => {
        const [inYear, inMonth, inDay] = b.checkInDate.split("-");
        const [outYear, outMonth, outDay] = b.checkOutDate.split("-");
        return {
          start: new Date(inYear, inMonth - 1, inDay),
          end: new Date(outYear, outMonth - 1, outDay),
        };
      });
  }, [room]);

  const getDiffDays = () => {
    if (!form.checkInDate || !form.checkOutDate) return 1;
    const checkIn = new Date(form.checkInDate);
    const checkOut = new Date(form.checkOutDate);
    if (checkOut <= checkIn) return 1;
    const diffTime = Math.abs(checkOut - checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const bookingPayload = useMemo(
    () => ({
      checkInDate: form.checkInDate,
      checkOutDate: form.checkOutDate,
      numOfAdults: Number(form.numOfAdults),
      numOfChildren: Number(form.numOfChildren),
      totalPrice: (room?.roomPrice || 0) * getDiffDays(),
    }),
    [form, room],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    const checkIn = new Date(form.checkInDate);
    const checkOut = new Date(form.checkOutDate);

    if (checkOut <= checkIn) {
      setError("Ngày trả phòng phải sau Ngày nhận phòng");
      setSubmitting(false);
      return;
    }

    if (room && room.bookings) {
      const isOverlap = room.bookings.some(b => {
        if (b.status === "CANCELLED") return false;
        const bIn = new Date(b.checkInDate);
        const bOut = new Date(b.checkOutDate);
        return checkIn < bOut && checkOut > bIn;
      });
      if (isOverlap) {
        setError("Rất tiếc! Khoảng thời gian này đã có người đặt. Vui lòng chọn ngày khác.");
        setSubmitting(false);
        return;
      }
    }

    try {
      if (!isAuthenticated) {
        navigate(
          `/auth?redirect=${encodeURIComponent(`/rooms/${roomId}/booking`)}`,
        );
        return;
      }

      const profile = user ?? (await refreshProfile());
      const response = await createBooking(roomId, profile.id, bookingPayload, token);
      
      if (paymentMethod === "VNPAY") {
        // Redirect to payment gateway
        setMessage("Đang chuyển hướng đến cổng thanh toán...");
        import("../../services/api").then(async ({ api }) => {
          try {
            const { data } = await api.get(`/payment/create-url/${response.booking.id}`);
            if (data && data.paymentUrl) {
              window.location.href = data.paymentUrl;
            } else {
              setError("Lỗi tạo đường dẫn thanh toán.");
              setSubmitting(false);
            }
          } catch (paymentErr) {
            setError("Lỗi kết nối cổng thanh toán.");
            setSubmitting(false);
          }
        });
      } else {
        // Pay later
        setMessage("Đặt phòng thành công! Đang chuyển hướng...");
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Đặt phòng thất bại. Vui lòng thử lại.",
      );
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
    <div className="grid gap-12 lg:grid-cols-[1.8fr_1fr] items-start">
      <section className="rounded-[40px] border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-10">
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
              <DatePicker
                selected={form.checkInDate ? (() => {
                  const [y, m, d] = form.checkInDate.split("-");
                  return new Date(y, m - 1, d);
                })() : null}
                onChange={(date) => {
                  if (date) {
                    const offset = date.getTimezoneOffset();
                    const localDate = new Date(date.getTime() - offset * 60 * 1000);
                    handleChange({ target: { name: "checkInDate", value: localDate.toISOString().split("T")[0] } });
                  } else {
                    handleChange({ target: { name: "checkInDate", value: "" } });
                  }
                }}
                excludeDateIntervals={disabledIntervals}
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                placeholderText="Chọn ngày nhận"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-300"
                required
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Ngày trả phòng
              </span>
              <DatePicker
                selected={form.checkOutDate ? (() => {
                  const [y, m, d] = form.checkOutDate.split("-");
                  return new Date(y, m - 1, d);
                })() : null}
                onChange={(date) => {
                  if (date) {
                    const offset = date.getTimezoneOffset();
                    const localDate = new Date(date.getTime() - offset * 60 * 1000);
                    handleChange({ target: { name: "checkOutDate", value: localDate.toISOString().split("T")[0] } });
                  } else {
                    handleChange({ target: { name: "checkOutDate", value: "" } });
                  }
                }}
                excludeDateIntervals={disabledIntervals}
                minDate={form.checkInDate ? (() => {
                  const [y, m, d] = form.checkInDate.split("-");
                  return new Date(y, m - 1, d);
                })() : new Date()}
                dateFormat="dd/MM/yyyy"
                placeholderText="Chọn ngày trả"
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

          <div className="rounded-[24px] border border-gray-100 p-5 mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              1. Thêm phương thức thanh toán
            </h3>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl cursor-pointer hover:border-rose-300 transition">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xs">VNP</div>
                  <span className="font-medium text-gray-800">Thanh toán trực tuyến (VNPay, ATM, Visa, MasterCard)</span>
                </div>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="VNPAY"
                  checked={paymentMethod === "VNPAY"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 accent-rose-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl cursor-pointer hover:border-rose-300 transition">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center font-bold text-xs">LATER</div>
                  <span className="font-medium text-gray-800">Đặt phòng trước, thanh toán sau</span>
                </div>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="PAY_LATER"
                  checked={paymentMethod === "PAY_LATER"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 accent-rose-500"
                />
              </label>
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

      <aside className="sticky top-28 rounded-[40px] border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-8">
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
