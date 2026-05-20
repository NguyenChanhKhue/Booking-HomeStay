import { CalendarDays, Check, MapPin, ShieldCheck, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getRoomById } from "../../services/propertyService";
import { DEFAULT_AMENITIES } from "../../utils/constants";
import { formatPrice } from "../../utils/formatPrice";

const inferAmenities = (room) => {
  const base = [...DEFAULT_AMENITIES];
  const description = `${room?.roomType ?? ""} ${room?.roomDescription ?? ""}`.toLowerCase();

  if (description.includes("family")) base.push("Phu hop cho gia dinh");
  if (description.includes("deluxe")) base.push("Thiet ke cao cap");
  if (description.includes("view")) base.push("Tam nhin thoang");
  if (description.includes("garden")) base.push("Gan khuon vien xanh");

  return Array.from(new Set(base)).slice(0, 6);
};

const PropertyDetailPage = () => {
  const { id, roomId: legacyRoomId } = useParams();
  const roomId = legacyRoomId ?? id;
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
        setError("Khong the tai thong tin chi tiet phong.");
      } finally {
        setLoading(false);
      }
    };

    loadRoom();
  }, [roomId]);

  const mapQuery = useMemo(() => {
    const location = searchParams.get("location");
    const keyword = searchParams.get("keyword");
    if (location) return location;
    if (keyword) return keyword;
    return room?.roomLocation || room?.roomType || "Vietnam homestay";
  }, [room?.roomLocation, room?.roomType, searchParams]);

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
        Dang tai thong tin phong...
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="rounded-[28px] border border-red-100 bg-red-50 p-6 text-red-600">
        {error || "Khong tim thay phong."}
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
              {room.roomLocation ? (
                <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
                  {room.roomLocation}
                </span>
              ) : null}
              <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600">
                Dat truc tiep tu he thong
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-gray-950">
              {room.roomType}
            </h1>
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
              <MapPin size={16} className="text-rose-500" />
              <span>{room.roomLocation || "Chua cap nhat dia diem"}</span>
            </div>
            <p className="mt-4 text-base leading-8 text-gray-600">
              {room.roomDescription || "Phong hien chua co mo ta chi tiet."}
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
              Gia tham khao
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-gray-950">
              {formatPrice(room.roomPrice)}
            </p>
            <p className="mt-2 text-sm text-gray-500">moi dem, chua bao gom dich vu phat sinh</p>

            <div className="mt-6 space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <Users size={18} className="text-rose-500" />
                <span>Phu hop cho khach ca nhan, cap doi hoac nhom nho</span>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDays size={18} className="text-rose-500" />
                <span>Co the kiem tra phong trong theo ngay truoc khi dat</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-rose-500" />
                <span>Thong tin booking duoc luu bang ma xac nhan tu backend</span>
              </div>
            </div>

            <Link
              to={bookingLink}
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-rose-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-rose-600"
            >
              Dat phong
            </Link>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5">
              <h2 className="text-xl font-semibold text-gray-950">Ban do khu vuc</h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <MapPin size={16} className="text-rose-500" />
                Hien thi dua theo dia diem cua phong hoac tu khoa tim kiem
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
