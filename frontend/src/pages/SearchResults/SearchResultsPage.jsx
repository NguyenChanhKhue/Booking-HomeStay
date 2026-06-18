import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../../components/cards/PropertyCard";
import { searchRooms } from "../../services/propertyService";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 10;

  const filters = useMemo(
    () => ({
      keyword: searchParams.get("keyword") ?? "",
      location: searchParams.get("location") ?? "",
      roomType: searchParams.get("roomType") ?? "",
      checkInDate: searchParams.get("checkInDate") ?? "",
      checkOutDate: searchParams.get("checkOutDate") ?? "",
      minPrice: searchParams.get("minPrice") ?? "",
      maxPrice: searchParams.get("maxPrice") ?? "",
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
        setError("Khong the tai ket qua tim kiem luc nay.");
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

  return (
    <div className="space-y-8 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 mt-4"
      >
        <div className="flex items-center justify-between gap-4 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">
            Kết quả tìm kiếm
          </h1>
          {!loading && !error && (
            <p className="text-sm font-medium text-rose-500 bg-rose-50 px-4 py-2 rounded-full">
              Tìm thấy <span className="font-black">{rooms.length}</span> phòng phù hợp
            </p>
          )}
        </div>
      </motion.div>

      {loading ? (
        <div className="rounded-[28px] border border-dashed border-gray-200 p-12 text-center text-gray-500">
          Dang tai danh sach phong...
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
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
              >
                Trang trước
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
                    currentPage === i + 1 
                      ? "bg-rose-500 text-white font-bold" 
                      : "border border-gray-200 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
              >
                Trang sau
              </button>
            </div>
          )}
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
