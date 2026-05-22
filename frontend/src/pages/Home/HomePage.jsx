import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import PropertyCard from "../../components/cards/PropertyCard";
import { getAllRooms, getRoomTypes } from "../../services/propertyService";

const FEATURED_LOCATIONS = [
  {
    id: "da-lat",
    name: "Da Lat",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "vung-tau",
    name: "Vung Tau",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "hoi-an",
    name: "Hoi An",
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
    name: "Phu Quoc",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=400&q=80",
  },
];



const HomePage = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const trendingRooms = [...rooms].sort((a, b) => (b.bookingCount || 0) - (a.bookingCount || 0)).slice(0, 10);
  const carouselRef = useRef(null);

  useEffect(() => {
    let intervalId;
    if (carouselRef.current && trendingRooms.length > 0) {
      intervalId = setInterval(() => {
        if (carouselRef.current) {
          carouselRef.current.scrollLeft += 1;
          if (
            carouselRef.current.scrollLeft >=
            carouselRef.current.scrollWidth - carouselRef.current.clientWidth
          ) {
            carouselRef.current.scrollLeft = 0;
          }
        }
      }, 30);
    }
    return () => clearInterval(intervalId);
  }, [trendingRooms.length]);

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
        console.error("Failed to load rooms:", fetchError);
        setError(
          fetchError.response?.data?.message ||
            fetchError.message ||
            "Khong the tai du lieu phong tu backend.",
        );
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="space-y-8 pb-6">
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
          <Link
            to="/search"
            className="shrink-0 text-sm font-medium text-rose-500"
          >
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
                to={`/search?location=${encodeURIComponent(location.name)}`}
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
              HomeStay xu hướng
            </h2>
            <Link to="/search" className="text-sm font-medium text-rose-500">
              Xem thêm
            </Link>
          </div>
          <div 
            ref={carouselRef}
            className="-mx-4 flex gap-7 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {trendingRooms.length > 0 ? trendingRooms.map((room) => (
              <div
                key={room.id}
                className="w-[82vw] shrink-0 sm:w-[360px] lg:w-[calc((100%_-_84px)/4)]"
              >
                <PropertyCard data={room} />
              </div>
            )) : (
              <div className="w-full text-center text-gray-500 py-8">Đang cập nhật...</div>
            )}
          </div>
        </section>

        {error ? (
          <div className="rounded-[28px] border border-red-100 bg-red-50 p-5 text-sm text-red-600">
            Loi tai du lieu: {error}
          </div>
        ) : null}

        {!loading && !error ? (
          <div className="text-sm text-gray-500">Các phòng hiện còn trống</div>
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
            Hiện chưa có phòng để hiện thị
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
