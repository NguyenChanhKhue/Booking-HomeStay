import { MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";

const PropertyCard = ({ data }) => {
  if (!data) return null;

  const description =
    data.roomDescription || "Khong gian luu tru duoc cap nhat tu he thong.";

  return (
    <Link
      to={`/rooms/${data.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={data.roomPhotoUrl || "https://via.placeholder.com/800x600?text=Room"}
          alt={data.roomType}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">
          {data.roomType}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-950">{data.roomType}</h3>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <MapPin size={14} className="text-rose-500" />
              <span>{data.roomLocation || "Chua cap nhat dia diem"}</span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
              {description}
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700">
            <Star size={14} className="fill-current" />
            <span>4.9</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-gray-100 pt-4">
          <div>
            <p className="text-sm text-gray-500">Gia moi dem</p>
            <p className="text-lg font-semibold text-gray-950">
              {formatPrice(data.roomPrice)}
            </p>
          </div>
          <span className="text-sm font-medium text-rose-500">Xem chi tiet</span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
