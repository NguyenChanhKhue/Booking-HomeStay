import { CalendarDays, Check, MapPin, ShieldCheck, Users, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getRoomById } from "../../services/propertyService";
import { DEFAULT_AMENITIES } from "../../utils/constants";
import { formatPrice } from "../../utils/formatPrice";

const inferAmenities = (room) => {
  const base = [...DEFAULT_AMENITIES];
  const description =
    `${room?.roomType ?? ""} ${room?.roomDescription ?? ""}`.toLowerCase();

  if (description.includes("family")) base.push("Phù hợp cho gia đình");
  if (description.includes("deluxe")) base.push("Thiết kế cao cấp");
  if (description.includes("view")) base.push("Tầm nhìn thoáng");
  if (description.includes("garden")) base.push("Gần khuôn viên xanh");

  return Array.from(new Set(base)).slice(0, 8);
};

const PropertyDetailPage = () => {
  const { id, roomId: legacyRoomId } = useParams();
  const roomId = legacyRoomId ?? id;
  const [searchParams] = useSearchParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImg, setActiveImg] = useState(0);

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
    return `${room?.roomType || ""} ${room?.roomLocation || ""}`.trim() || "Vietnam homestay";
  }, [room?.roomLocation, room?.roomType]);

  const amenities = useMemo(() => inferAmenities(room), [room]);
  const bookingLink = useMemo(() => {
    const params = new URLSearchParams();
    const checkInDate = searchParams.get("checkInDate");
    const checkOutDate = searchParams.get("checkOutDate");
    const location = searchParams.get("location");
    if (checkInDate) params.set("checkInDate", checkInDate);
    if (checkOutDate) params.set("checkOutDate", checkOutDate);
    if (location) params.set("location", location);
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

  const images = [
    room.roomPhotoUrl,
    ...(room.additionalImages || []),
  ].filter(Boolean);

  return (
    <div className="space-y-10">
      {/* Title & Tags */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="rounded-full bg-rose-50 border border-rose-100 px-3 py-1 text-xs font-bold text-rose-600">
            {room.roomType}
          </span>
          {room.roomLocation && (
            <span className="flex items-center gap-1 rounded-full bg-gray-50 border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700">
              <MapPin size={12} className="text-rose-500" />
              {room.roomLocation}
            </span>
          )}
          <span className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 hidden sm:inline-flex">
            ✓ Đặt trực tiếp từ hệ thống
          </span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-950">
          {room.roomType}
        </h1>
        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={14} className="fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-1 font-medium text-gray-700">5.0</span>
          </div>
          <span>·</span>
          <span>{room.roomLocation || "Việt Nam"}</span>
        </div>
      </motion.div>

      {/* Main 2-col Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-10 lg:grid-cols-[1fr_380px] items-start"
      >
        {/* LEFT: Images + Info */}
        <div className="space-y-8">

          {/* Image Gallery */}
          <div className="overflow-hidden rounded-[32px] bg-gray-100">
            {/* Main image */}
            <div className="relative h-[420px] lg:h-[500px] w-full overflow-hidden">
              <img
                src={images[activeImg] || "https://via.placeholder.com/1200x800?text=Room"}
                alt={room.roomType}
                className="h-full w-full object-cover transition-all duration-700"
              />
              {/* Overlay gradient bottom */}
              <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImg(i)}
                    className={`shrink-0 h-16 w-24 rounded-xl overflow-hidden border-2 transition ${
                      i === activeImg ? "border-rose-500 opacity-100" : "border-transparent opacity-60 hover:opacity-90"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Về phòng này</h2>
            <p className="text-base leading-relaxed text-gray-600">
              {room.roomDescription || "Phòng chưa có mô tả chi tiết."}
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Tiện nghi</h2>
            <div className="grid grid-cols-2 gap-4">
              {amenities.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-50">
                    <Check size={16} className="text-rose-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Booking Card (no sticky) + Map */}
        <div className="space-y-6">
          <div className="rounded-[32px] border border-gray-200/60 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden">
            
            {/* Price header */}
            <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-6 text-white">
              <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Giá mỗi đêm</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">{formatPrice(room.roomPrice)}</span>
              </div>
              <p className="text-xs opacity-70 mt-1">Chưa bao gồm dịch vụ phát sinh</p>
            </div>

            {/* Info */}
            <div className="p-6 space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Users size={18} className="text-rose-500 mt-0.5 shrink-0" />
                  <span className="text-gray-700 font-medium leading-snug">Phù hợp cho khách cá nhân hoặc nhóm nhỏ</span>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarDays size={18} className="text-rose-500 mt-0.5 shrink-0" />
                  <span className="text-gray-700 font-medium leading-snug">Kiểm tra phòng trống theo ngày trước khi đặt</span>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck size={18} className="text-rose-500 mt-0.5 shrink-0" />
                  <span className="text-gray-700 font-medium leading-snug">Đặt phòng trực tiếp từ hệ thống – an toàn &amp; bảo mật</span>
                </div>
              </div>

              <Link
                to={bookingLink}
                className="mt-2 flex w-full items-center justify-center rounded-full bg-rose-500 hover:bg-rose-600 px-8 py-4 text-base font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rose-500/30"
              >
                Đặt phòng ngay
              </Link>

              <p className="text-center text-xs text-gray-400">Không mất phí khi hủy trong 24 giờ đầu</p>
            </div>
          </div>

          {/* Map in right column */}
          <div className="overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-sm">
            <div className="px-6 py-5 border-b border-gray-50">
              <h2 className="text-lg font-bold text-gray-950">Bản đồ khu vực</h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                <MapPin size={13} className="text-rose-500" />
                {room.roomLocation || "Việt Nam"}
              </p>
            </div>
            <iframe
              title="Room area map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
              className="h-[280px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PropertyDetailPage;
