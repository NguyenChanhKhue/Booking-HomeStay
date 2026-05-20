import PropertyCard from "../../components/cards/PropertyCard";

const HomePage = () => {
  // Đặt tên là rooms để khớp với lệnh map bên dưới
  const rooms = [
    { id: 1, location: "Đà Lạt, Lâm Đồng", price: "1.200.000", rating: "4.9", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000" },
    { id: 2, location: "Hội An, Quảng Nam", price: "950.000", rating: "4.8", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1000" },
    { id: 3, location: "Sa Pa, Lào Cai", price: "1.500.000", rating: "5.0", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000" },
    { id: 4, location: "Ninh Bình", price: "700.000", rating: "4.7", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000" },
  ];

  return (
    <div className="w-full">
      {/* Thanh Category với hover hồng */}
      <div className="flex gap-8 border-b border-gray-100 mb-10 overflow-x-auto no-scrollbar py-1">
        {["Tất cả", "Đà Lạt", "Hội An", "Sa Pa", "Vũng Tàu", "Hà Giang", "Ninh Bình"].map((city, index) => (
          <button 
            key={city} 
            className={`pb-4 text-[15px] whitespace-nowrap transition-all ${
              index === 0 
              ? "font-semibold text-rose-500 border-b-2 border-rose-500" 
              : "font-medium text-gray-600 hover:text-rose-500 hover:border-b-2 hover:border-rose-500/50"
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      <div className="mb-8 px-1">
        <h2 className="text-3xl font-bold text-gray-950 tracking-tight">Chỗ ở nổi bật tại Việt Nam</h2>
        <p className="text-gray-600 text-lg mt-1 font-light">Những căn homestay được đánh giá cao nhất</p>
      </div>

      {/* Grid: Tăng lên 5-6 cột để card thanh thoát như mẫu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-6 gap-y-12">
        {rooms.map((room) => (
          <PropertyCard key={room.id} data={room} />
        ))}
        {/* Render thêm để test độ rộng màn hình */}
        {rooms.map((room) => (
          <PropertyCard key={`extra-${room.id}`} data={room} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;