import { MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";

const PropertyCard = ({ data }) => {
  if (!data) return null;

  const description =
    data.roomDescription || "Khong gian luu tru duoc cap nhat tu he thong.";

  return (
    <Link
      to={`/property/${data.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={data.roomPhotoUrl || "https://via.placeholder.com/800x600?text=Room"}
          alt={data.roomType}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 max-w-[calc(100%-2rem)] truncate rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-rose-500">
          {data.roomType}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-xl font-semibold text-gray-950">{data.roomType}</h3>
            {data.roomLocation ? (
              <p className="mt-1 flex items-center gap-1 text-sm font-medium text-gray-500">
                <MapPin size={14} className="shrink-0 text-rose-500" />
                <span className="truncate">{data.roomLocation}</span>
              </p>
            ) : null}
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-600">
              {description}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700">
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
