import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../../components/cards/PropertyCard";
import Search from "../../components/navbar/Search";
import { searchRooms } from "../../services/propertyService";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const filters = useMemo(
    () => ({
      keyword: searchParams.get("keyword") ?? "",
      roomType: searchParams.get("roomType") ?? "",
      checkInDate: searchParams.get("checkInDate") ?? "",
      checkOutDate: searchParams.get("checkOutDate") ?? "",
      minPrice: searchParams.get("minPrice") ?? "",
      maxPrice: searchParams.get("maxPrice") ?? "",
    }),
    [searchParams]
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

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-gray-100 bg-[linear-gradient(135deg,#ffffff_0%,#fff7f7_100%)] p-6 shadow-sm md:p-8">
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-500">
              Kết quả tìm kiếm
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950 md:text-5xl">
              {filters.keyword
                ? `Những chỗ ở phù hợp với "${filters.keyword}"`
                : "Khám phá các phòng đang có sẵn"}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600">
              Dữ liệu được lấy từ API tìm kiếm phòng của hệ thống, có hỗ trợ lọc
              theo khoảng ngày nếu bạn đã chọn ở thanh tìm kiếm.
            </p>
          </div>
          <Search compact initialValues={filters} />
        </div>
      </section>

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
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Tìm thấy <span className="font-semibold text-gray-900">{rooms.length}</span> phòng phù hợp
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {rooms.map((room) => (
              <PropertyCard key={room.id} data={room} />
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-[28px] border border-dashed border-gray-200 p-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-950">
            Chưa có phòng khớp với bộ lọc hiện tại
          </h2>
          <p className="mt-3 text-gray-600">
            Bạn có thể đổi ngày, bỏ bớt điều kiện hoặc tìm bằng từ khóa khu vực khác.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
