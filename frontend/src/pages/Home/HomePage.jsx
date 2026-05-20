import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropertyCard from "../../components/cards/PropertyCard";
import { getAllRooms, getRoomTypes } from "../../services/propertyService";

const FEATURED_LOCATIONS = [
  {
    id: "da-lat",
    name: "Đà Lạt",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "vung-tau",
    name: "Vũng Tàu",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "hoi-an",
    name: "Hội An",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "sa-pa",
    name: "Sa Pa",
    image:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "nha-trang",
    name: "Nha Trang",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "phu-quoc",
    name: "Phú Quốc",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=400&q=80",
  },
];

const TRENDING_HOMESTAYS = [
  {
    id: 1,
    roomType: "Cabin Đà Lạt",
    roomLocation: "Đà Lạt",
    roomDescription: "Không gian gỗ ấm áp, gần rừng thông và khu cà phê.",
    roomPrice: 850000,
    roomPhotoUrl:
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    roomType: "Beach House",
    roomLocation: "Vũng Tàu",
    roomDescription: "Homestay gần biển, phù hợp cho nhóm bạn cuối tuần.",
    roomPrice: 1200000,
    roomPhotoUrl:
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    roomType: "Villa Hội An",
    roomLocation: "Hội An",
    roomDescription: "Sân vườn yên tĩnh, tiện di chuyển vào phố cổ.",
    roomPrice: 1450000,
    roomPhotoUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    roomType: "Mountain View",
    roomLocation: "Sa Pa",
    roomDescription: "Tầm nhìn núi thoáng, không gian nghỉ dưỡng riêng tư.",
    roomPrice: 990000,
    roomPhotoUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    roomType: "Island Retreat",
    roomLocation: "Phú Quốc",
    roomDescription: "Căn nghỉ dưỡng nhiều ánh sáng, gần bãi biển.",
    roomPrice: 1600000,
    roomPhotoUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
  },
];

const HomePage = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      setError("");

      try {
        const roomList = await getAllRooms();
        setRooms(roomList);

        try {
          const types = await getRoomTypes();
          setRoomTypes(types);
        } catch (typeError) {
          console.error("Failed to load room types:", typeError);
          setRoomTypes([]);
        }
      } catch (fetchError) {
        console.error("Failed to load featured rooms:", fetchError);
        setError(
          fetchError.response?.data?.message ||
            fetchError.message ||
            "Khong the tai du lieu phong tu backend."
        );
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="space-y-6 pb-6">
      <section className="space-y-6">
        <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 md:flex-row md:items-center md:justify-between">
          {roomTypes.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {roomTypes.map((type) => (
                <Link
                  key={type}
                  to={`/search?roomType=${encodeURIComponent(type)}`}
                  className="shrink-0 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-gray-950 hover:text-gray-950"
                >
                  {type}
                </Link>
              ))}
            </div>
          ) : null}
          <Link to="/search" className="shrink-0 text-sm font-medium text-rose-500">
            Xem tat ca
          </Link>
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-950">
              Địa điểm nổi bật
            </h2>
          </div>
          <div className="-mx-4 flex gap-5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            {FEATURED_LOCATIONS.map((location) => (
              <Link
                key={location.id}
                to={`/search?keyword=${encodeURIComponent(location.name)}`}
                className="group flex w-24 shrink-0 flex-col items-center gap-3 text-center"
              >
                <div className="h-20 w-20 overflow-hidden rounded-full bg-gray-100 ring-1 ring-gray-100 transition group-hover:ring-gray-950">
                  <img
                    src={location.image}
                    alt={location.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  {location.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-950">
              Homestay xu hướng
            </h2>
            <Link to="/search" className="text-sm font-medium text-rose-500">
              Xem thêm
            </Link>
          </div>
          <div className="-mx-4 flex snap-x gap-7 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0">
            {TRENDING_HOMESTAYS.map((room) => (
              <div
                key={room.id}
                className="w-[82vw] shrink-0 snap-start sm:w-[360px] lg:w-[calc((100%_-_84px)/4)]"
              >
                <PropertyCard data={room} />
              </div>
            ))}
          </div>
        </section>

        {error ? (
          <div className="rounded-[28px] border border-red-100 bg-red-50 p-5 text-sm text-red-600">
            Loi tai du lieu: {error}
          </div>
        ) : null}

        {!loading && !error ? (
          <div className="text-sm text-gray-500">
            Hien co <span className="font-semibold text-gray-900">{rooms.length}</span> phong tu backend.
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-[28px] border border-dashed border-gray-200 p-12 text-center text-gray-500">
            Dang tai danh sach phong...
          </div>
        ) : rooms.length > 0 ? (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {rooms.map((room) => (
              <PropertyCard key={room.id} data={room} />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-gray-200 p-12 text-center text-gray-500">
            Hien chua co phong de hien thi tren trang chu.
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
