import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../../components/cards/PropertyCard";
import { searchRooms } from "../../services/propertyService";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div className="space-y-6">
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
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Tìm thấy{" "}
              <span className="font-semibold text-gray-900">
                {rooms.length}
              </span>{" "}
              phòng phù hợp
            </p>
          </div>
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {rooms.map((room) => (
              <PropertyCard key={room.id} data={room} />
            ))}
          </div>
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
