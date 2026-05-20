import { CalendarDays, Check, MapPin, ShieldCheck, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getRoomById } from "../../services/propertyService";
import { DEFAULT_AMENITIES } from "../../utils/constants";
import { formatPrice } from "../../utils/formatPrice";

const inferAmenities = (room) => {
  const base = [...DEFAULT_AMENITIES];
  const description = `${room?.roomType ?? ""} ${room?.roomDescription ?? ""}`.toLowerCase();

  if (description.includes("family")) base.push("Phù hợp cho gia đình");
  if (description.includes("deluxe")) base.push("Thiết kế cao cấp");
  if (description.includes("view")) base.push("Tầm nhìn thoáng");
  if (description.includes("garden")) base.push("Gần khuôn viên xanh");

  return Array.from(new Set(base)).slice(0, 6);
};

const PropertyDetailPage = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRoom = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getRoomById(roomId);
        setRoom(data);
      } catch (err) {
        setError("Không thể tải thông tin chi tiết phòng.");
      } finally {
        setLoading(false);
      }
    };

    loadRoom();
  }, [roomId]);

  const mapQuery = useMemo(() => {
    const keyword = searchParams.get("keyword");
    if (keyword) return keyword;
    return room?.roomType || "Vietnam homestay";
  }, [room?.roomType, searchParams]);

  const amenities = useMemo(() => inferAmenities(room), [room]);
  const bookingLink = useMemo(() => {
    const params = new URLSearchParams();
    const checkInDate = searchParams.get("checkInDate");
    const checkOutDate = searchParams.get("checkOutDate");
    if (checkInDate) params.set("checkInDate", checkInDate);
    if (checkOutDate) params.set("checkOutDate", checkOutDate);
    return `/rooms/${roomId}/booking${params.toString() ? `?${params}` : ""}`;
  }, [roomId, searchParams]);

  if (loading) {
    return (
      <div className="rounded-[28px] border border-dashed border-gray-200 p-12 text-center text-gray-500">
        Đang tải thông tin phòng...
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="rounded-[28px] border border-red-100 bg-red-50 p-6 text-red-600">
        {error || "Không tìm thấy phòng."}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-[36px] border border-gray-100 bg-white shadow-sm">
            <div className="aspect-[16/10] bg-gray-100">
              <img
                src={room.roomPhotoUrl || "https://via.placeholder.com/1200x800?text=Room"}
                alt={room.roomType}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-500">
                {room.roomType}
              </span>
              <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600">
                Đặt trực tiếp từ hệ thống
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-gray-950">
              {room.roomType}
            </h1>
            <p className="mt-4 text-base leading-8 text-gray-600">
              {room.roomDescription || "Phòng hiện chưa có mô tả chi tiết."}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {amenities.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4"
                >
                  <Check size={18} className="text-rose-500" />
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
              Giá tham khảo
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-gray-950">
              {formatPrice(room.roomPrice)}
            </p>
            <p className="mt-2 text-sm text-gray-500">mỗi đêm, chưa bao gồm dịch vụ phát sinh</p>

            <div className="mt-6 space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <Users size={18} className="text-rose-500" />
                <span>Phù hợp cho khách cá nhân, cặp đôi hoặc nhóm nhỏ</span>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDays size={18} className="text-rose-500" />
                <span>Có thể kiểm tra phòng trống theo ngày trước khi đặt</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-rose-500" />
                <span>Thông tin booking được lưu bằng mã xác nhận từ backend</span>
              </div>
            </div>

            <Link
              to={bookingLink}
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-rose-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-rose-600"
            >
              Đặt phòng
            </Link>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5">
              <h2 className="text-xl font-semibold text-gray-950">Bản đồ khu vực</h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <MapPin size={16} className="text-rose-500" />
                Hiển thị theo từ khóa tìm kiếm hoặc loại phòng hiện tại
              </p>
            </div>
            <iframe
              title="Room area map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
              className="h-[320px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertyDetailPage;
