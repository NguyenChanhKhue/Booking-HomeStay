import { Heart } from 'lucide-react';

const PropertyCard = ({ data }) => {
  // Kiểm tra nếu không có data để tránh crash trang (lỗi hay gặp khi deploy)
  if (!data) return null;

  return (
    <div className="flex flex-col gap-2 cursor-pointer group w-full">
      {/* Container ảnh: Luôn giữ tỷ lệ vuông (1:1) dù mở trên máy tính hay điện thoại */}
      <div className="aspect-square w-full relative overflow-hidden rounded-2xl bg-gray-100">
        <img 
          src={data.image || 'https://via.placeholder.com/400'} 
          className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300 ease-in-out" 
          alt={data.location || "Homestay"}
        />
        
        {/* Nút tim: Cố định vị trí, không bị lệch khi co giãn màn hình */}
        <button className="absolute top-3 right-3 p-1 hover:scale-110 transition">
           <Heart 
             size={24} 
             className="text-white stroke-[2px] fill-black/20 hover:fill-rose-500 hover:text-rose-500 transition-colors" 
           />
        </button>
      </div>
      
      {/* Phần thông tin: Dùng text-sm/text-base để tự điều chỉnh cỡ chữ trên mobile */}
      <div className="flex flex-col mt-1 px-1">
        <div className="flex justify-between items-start">
          <span className="font-bold text-[15px] md:text-[16px] text-gray-900 line-clamp-1">
            {data.location}
          </span>
          <div className="flex items-center gap-1 text-sm shrink-0">
            <span className="text-black">★</span>
            <span className="font-light text-gray-600">{data.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-500 font-light text-[14px] md:text-[15px] line-clamp-1">
          Chủ nhà siêu cấp
        </p>
        <p className="text-gray-500 font-light text-[14px] md:text-[15px]">
          Ngày 10 - 15 tháng 6
        </p>
        
        <div className="mt-1.5 flex items-center gap-1">
          <span className="font-bold text-[16px]">{data.price}đ</span>
          <span className="font-light text-gray-600">/ đêm</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;