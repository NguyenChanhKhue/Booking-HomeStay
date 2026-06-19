import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, Users, MapPin, Star, Award, ChevronRight } from "lucide-react";
import PropertyCard from "../../components/cards/PropertyCard";
import Search from "../../components/navbar/Search";
import SkeletonCard from "../../components/ui/SkeletonCard";
import EmptyState from "../../components/ui/EmptyState";
import Pagination from "../../components/Pagination";
import CountUp from "../../components/ui/CountUp";
import { getAllRooms, getRoomTypes } from "../../services/propertyService";

const FEATURED_LOCATIONS = [
  {
    id: "da-lat",
    name: "Đà Lạt",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    propertyCount: "1,200",
  },
  {
    id: "vung-tau",
    name: "Vũng Tàu",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
    propertyCount: "850",
  },
  {
    id: "hoi-an",
    name: "Hội An",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=400&q=80",
    propertyCount: "920",
  },
  {
    id: "sa-pa",
    name: "Sa Pa",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=400&q=80",
    propertyCount: "430",
  },
  {
    id: "nha-trang",
    name: "Nha Trang",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80",
    propertyCount: "1,500",
  }
];

const HomePage = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 12;

  const trendingRooms = [...rooms]
    .sort((a, b) => (b.bookingCount || 0) - (a.bookingCount || 0))
    .slice(0, 10);

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
            "Failed to load rooms",
        );
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  // Pagination logic
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(rooms.length / roomsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="pb-6">
      {/* Hero Section */}
      <section className="relative z-20 h-[50vh] min-h-[380px] w-[100vw] ml-[calc(-50vw+50%)] mb-8 -mt-[88px]">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Resort"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay giúp chữ nổi bật mà không làm tối toàn bộ ảnh */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/5 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative h-full w-full flex flex-col justify-center items-center text-center pt-[130px] pb-6 px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] [text-shadow:_0_2px_15px_rgb(0_0_0_/_60%)]"
          >
            Khám phá không gian <br className="hidden md:block" /> lưu trú tuyệt vời
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-base md:text-lg text-white/95 mb-8 max-w-2xl font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          >
            Trải nghiệm những khoảnh khắc đáng nhớ với hàng ngàn lựa chọn chỗ ở độc đáo trên khắp Việt Nam.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-5xl"
          >
            <Search />
          </motion.div>
        </div>
      </section>

      <div className="space-y-10 relative z-10 mt-4">


        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
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
                <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gray-100 ring-2 ring-transparent transition-all duration-300 group-hover:ring-rose-500 group-hover:shadow-lg">
                  <img
                    src={location.image}
                    alt={location.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                </div>
                <span className="text-sm font-bold text-gray-800 text-center w-full transition-colors group-hover:text-rose-500">
                  {location.name}
                </span>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Trending Section */} 
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
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
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="w-[82vw] shrink-0 sm:w-[360px] lg:w-[calc((100%_-_84px)/4)]">
                  <SkeletonCard />
                </div>
              ))
            ) : trendingRooms.length > 0 ? (
              trendingRooms.map((room) => (
                <div
                  key={`trend-${room.id}`}
                  className="w-[82vw] shrink-0 sm:w-[360px] lg:w-[calc((100%_-_84px)/4)]"
                >
                  <PropertyCard data={room} />
                </div>
              ))
            ) : (
              <div className="w-full text-center text-gray-500 py-8">
                Đang cập nhật...
              </div>
            )}
          </div>
        </motion.section>

        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">Khám phá tất cả</h2>
          </div>

        {error ? (
          <div className="rounded-[28px] border border-red-100 bg-red-50 p-5 text-sm text-red-600">
            Lỗi tải dữ liệu: {error}
          </div>
        ) : null}

        {!loading && !error ? (
          <div className="text-sm text-gray-500">Các phòng hiện còn trống</div>
        ) : null}

        {loading ? (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {Array(8).fill(0).map((_, i) => (
              <SkeletonCard key={`skel-${i}`} />
            ))}
          </div>
        ) : currentRooms.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
              {currentRooms.map((room) => (
                <PropertyCard key={room.id} data={room} />
              ))}
            </div>
            
            <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
          </>
        ) : (
          <EmptyState onReset={() => window.location.reload()} />
        )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
