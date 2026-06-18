import { MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { formatPrice } from "../../utils/formatPrice";

const PropertyCard = ({ data }) => {
  if (!data) return null;

  const description =
    data.roomDescription || "Khong gian luu tru duoc cap nhat tu he thong.";

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="h-full"
    >
      <Link
        to={`/property/${data.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all duration-300"
      >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={data.roomPhotoUrl || "https://via.placeholder.com/800x600?text=Room"}
          alt={data.roomType}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="absolute left-4 top-4 max-w-[calc(100%-2rem)] truncate rounded-full bg-white/85 backdrop-blur-md border border-white/40 shadow-sm px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-900">
          {data.roomType}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-xl font-bold text-gray-950 group-hover:text-rose-500 transition-colors">{data.roomType}</h3>
            {data.roomLocation ? (
              <p className="mt-1 flex items-center gap-1 text-sm font-medium text-gray-500">
                <MapPin size={14} className="shrink-0 text-rose-500" />
                <span className="truncate">{data.roomLocation}</span>
              </p>
            ) : null}
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">
              {description}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700">
            <Star size={14} className="fill-current" />
            <span>4.9</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-gray-100 pt-5">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Giá mỗi đêm</p>
            <p className="text-xl font-black text-rose-500">
              {formatPrice(data.roomPrice)}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-rose-50 px-5 py-2.5 text-sm font-bold text-rose-600 transition-colors group-hover:bg-rose-500 group-hover:text-white">
            Xem chi tiết
          </span>
        </div>
      </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;
