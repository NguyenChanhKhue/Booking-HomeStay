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

      {/* ═══════════════════════════════════════════
          ROW 1: Image Gallery (left) | Price Card (right, stretch height)
          Dùng items-stretch để card phải kéo cao bằng ảnh trái
      ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-6 lg:grid-cols-[1fr_380px] items-stretch"
      >
        {/* ─── LEFT col: Image Gallery ─── */}
        <div className="flex flex-col gap-4">

          {/* Khung ảnh chính cố định tỷ lệ 16/9 (hoặc 4/3) — khóa layer với overflow:hidden và bo góc */}
          <div className="relative w-full aspect-[4/3] lg:aspect-[16/9] overflow-hidden rounded-[32px] shadow-sm bg-gray-100">
            <img
              src={images[activeImg] || 'https://via.placeholder.com/1200x800?text=Room'}
              alt={room.roomType}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
            />
            {/* gradient overlay – không ảnh hưởng layout */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          {/* Thumbnails – cách ảnh chính khoảng gap hợp lý, không nén */}
          {images.length > 1 && (
            <div className="flex shrink-0 gap-3 overflow-x-auto py-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImg(i)}
                  className={`relative shrink-0 h-16 w-24 overflow-hidden rounded-xl border-2 transition ${
                    i === activeImg
                      ? 'border-rose-500'
                      : 'border-transparent opacity-60 hover:opacity-90'
                  }`}
                >
                  <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── RIGHT col: Price Card ───
             flex flex-col + h-full → kéo giãn bằng cột trái (items-stretch ở grid cha).
        ─────────────────────────────── */}
        <div className="flex h-full flex-col overflow-hidden rounded-[32px] border border-gray-200/60 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)]">

          {/* 1. Nhóm nội dung phía trên (Banner giá + Danh sách tiện ích) */}
          <div className="flex flex-col">
            {/* Banner giá */}
            <div className="shrink-0 bg-gradient-to-br from-rose-500 to-rose-600 p-7 text-white">
              <p className="mb-2 text-sm font-bold uppercase tracking-widest opacity-80">Giá mỗi đêm</p>
              <p className="text-5xl font-black leading-none">{formatPrice(room.roomPrice)}</p>
              <p className="mt-2 text-sm opacity-70">Chưa bao gồm dịch vụ phát sinh</p>
            </div>

            {/* Các bullet thông tin */}
            <div className="p-7">
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-50">
                    <Users size={20} className="text-rose-500" />
                  </div>
                  <span className="text-base font-medium leading-snug text-gray-700">
                    Phù hợp cho khách cá nhân hoặc nhóm nhỏ
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-50">
                    <CalendarDays size={20} className="text-rose-500" />
                  </div>
                  <span className="text-base font-medium leading-snug text-gray-700">
                    Kiểm tra phòng trống theo ngày trước khi đặt
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-50">
                    <ShieldCheck size={20} className="text-rose-500" />
                  </div>
                  <span className="text-base font-medium leading-snug text-gray-700">
                    Đặt phòng trực tiếp từ hệ thống – an toàn &amp; bảo mật
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* 2. Khối nút bấm (Đẩy xuống đáy thẻ bằng mt-auto) */}
          <div className="mt-auto p-7 pt-0 space-y-3">
            <Link
              to={bookingLink}
              className="flex w-full items-center justify-center rounded-full bg-rose-500 px-8 py-4 text-lg font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-600 hover:shadow-xl hover:shadow-rose-500/30"
            >
              Đặt phòng ngay
            </Link>
            <p className="text-center text-sm text-gray-400">Không mất phí khi hủy trong 24 giờ đầu</p>
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════
          ROW 2: Info + Amenities (left) | Map (right, top-aligned với row 2)
          items-start để map KHÔNG bị kéo cao theo cột trái
      ═══════════════════════════════════════════ */}
      {/* ─── ROW 2 dùng items-stretch → Map tự kéo giãn bằng cột trái ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid gap-6 lg:grid-cols-[1fr_380px] items-stretch"
      >
        {/* LEFT col: Về phòng + Tiện nghi xếp dọc */}
        <div className="flex flex-col gap-6">
          <div className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="mb-3 text-xl font-bold text-gray-900">Về phòng này</h2>
            <p className="text-base leading-relaxed text-gray-600">
              {room.roomDescription || 'Phòng chưa có mô tả chi tiết.'}
            </p>
          </div>

          <div className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-gray-900">Tiện nghi</h2>
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

        {/* RIGHT col: Map – h-full + flex flex-col → iframe lấp đầy, không thò xuống */}
        <div className="flex h-full flex-col overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-sm">
          <div className="shrink-0 border-b border-gray-50 px-6 py-5">
            <h2 className="text-lg font-bold text-gray-950">Bản đồ khu vực</h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
              <MapPin size={13} className="text-rose-500" />
              {room.roomLocation || 'Việt Nam'}
            </p>
          </div>
          {/* flex-1 + min-h-0: iframe co giãn đúng bằng phần còn lại của khung */}
          <iframe
            title="Room area map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
            className="min-h-0 flex-1 w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default PropertyDetailPage;
