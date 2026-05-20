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
      location: searchParams.get("location") ?? "",
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
        setError("Khong the tai ket qua tim kiem luc nay.");
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [filters]);

  const activeLocation = filters.location || filters.keyword;

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-gray-100 bg-[linear-gradient(135deg,#ffffff_0%,#fff7f7_100%)] p-6 shadow-sm md:p-8">
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-500">
              Ket qua tim kiem
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950 md:text-5xl">
              {activeLocation
                ? `Nhung cho o phu hop voi "${activeLocation}"`
                : "Kham pha cac phong dang co san"}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600">
              Du lieu duoc lay tu API tim kiem phong cua he thong va ho tro loc theo dia diem,
              loai phong, khoang gia va khoang ngay luu tru.
            </p>
          </div>
          <Search compact initialValues={filters} />
        </div>
      </section>

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
              Tim thay <span className="font-semibold text-gray-900">{rooms.length}</span> phong phu hop
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
            Chua co phong khop voi bo loc hien tai
          </h2>
          <p className="mt-3 text-gray-600">
            Ban co the doi dia diem, doi ngay hoac bo bot dieu kien de mo rong ket qua.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
