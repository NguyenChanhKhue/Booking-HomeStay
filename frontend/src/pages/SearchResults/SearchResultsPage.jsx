import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../../components/cards/PropertyCard";
import Search from "../../components/navbar/Search";
import Pagination from "../../components/Pagination";
import { searchRooms } from "../../services/propertyService";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 12;

  const filters = useMemo(
    () => ({
      keyword: searchParams.get("keyword") ?? "",
      location: searchParams.get("location") ?? "",
      roomType: searchParams.get("roomType") ?? "",
      checkInDate: searchParams.get("checkInDate") ?? "",
      checkOutDate: searchParams.get("checkOutDate") ?? "",
      minPrice: searchParams.get("minPrice") ?? "",
      maxPrice: searchParams.get("maxPrice") ?? "",
      amenities: searchParams.get("amenities") ?? "",
    }),
    [searchParams],
  );

  useEffect(() => {
    const loadRooms = async () => {
      setLoading(true);
      setError("");

      try {
        const results = await searchRooms(filters);
        setRooms(results);
      } catch (err) {
        setError("Không thể tải kết quả tìm kiếm lúc này.");
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [filters]);

  // Pagination logic
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(rooms.length / roomsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const hasSearchParams = Array.from(searchParams.keys()).length > 0;
  const pageTitle = hasSearchParams ? "Kết quả tìm kiếm" : "Khám phá tất cả chỗ ở";
  const subTitle = hasSearchParams ? `Tìm thấy ${rooms.length} phòng phù hợp` : `Có sẵn ${rooms.length} phòng`;

  return (
    <div className="space-y-8 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 mt-4"
      >
        <div className="flex items-center justify-between gap-4 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">
            {pageTitle}
          </h1>
          {!loading && !error && (
            <p className="text-sm font-medium text-rose-500 bg-rose-50 px-4 py-2 rounded-full">
              {hasSearchParams ? "Tìm thấy" : "Có sẵn"} <span className="font-black">{rooms.length}</span> {hasSearchParams ? "phòng phù hợp" : "phòng"}
            </p>
          )}
        </div>
        
        {/* Thanh công cụ tìm kiếm / lọc */}
        <div className="mt-6 bg-gray-50/50 -mx-6 -mb-6 p-6 rounded-b-[32px] border-t border-gray-100">
          <Search fullWidth={true} initialValues={filters} />
        </div>
      </motion.div>

      {loading ? (
        <div className="rounded-[28px] border border-dashed border-gray-200 p-12 text-center text-gray-500">
          Đang tải danh sách phòng...
        </div>
      ) : error ? (
        <div className="rounded-[28px] border border-red-100 bg-red-50 p-6 text-red-600">
          {error}
        </div>
      ) : rooms.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {currentRooms.map((room) => (
              <PropertyCard key={room.id} data={room} />
            ))}
          </div>

          {/* Pagination UI */}
          <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
        </>
      ) : (
        <div className="rounded-[28px] border border-dashed border-gray-200 p-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-950">
            Chưa có phòng phù hợp
          </h2>
          <p className="mt-3 text-gray-600">
            Bạn có thể đổi địa điểm , đổi ngày hoặc bỏ bớt điều kiện để mở rộng
            kết quả.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
