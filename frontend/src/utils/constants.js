export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export const REGION_SUGGESTIONS = [
  {
    id: "da-lat",
    name: "Đà Lạt",
    description: "Không khí lạnh, nhà kính và những homestay giữa đồi thông.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "hoi-an",
    name: "Hội An",
    description: "Phố cổ yên bình, tiện dạo bộ và nghỉ dưỡng cuối tuần.",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "sa-pa",
    name: "Sa Pa",
    description: "Săn mây, ngắm núi và ở trong những căn phòng ấm áp.",
    image:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "ninh-binh",
    name: "Ninh Bình",
    description: "Không gian xanh, yên tĩnh, phù hợp cho chuyến đi thư giãn.",
    image:
      "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80",
  },
];

export const DEFAULT_AMENITIES = [
  "Wi-Fi tốc độ cao",
  "Không gian riêng tư",
  "Hỗ trợ nhận phòng linh hoạt",
  "Khu vực nghỉ ngơi thoải mái",
];
