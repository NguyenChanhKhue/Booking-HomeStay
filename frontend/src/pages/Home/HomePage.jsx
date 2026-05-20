import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropertyCard from "../../components/cards/PropertyCard";
import Search from "../../components/navbar/Search";
import { getFeaturedRooms, getRoomTypes } from "../../services/propertyService";
import { REGION_SUGGESTIONS } from "../../utils/constants";

const HomePage = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      setError("");

      try {
        const rooms = await getFeaturedRooms();
        setFeaturedRooms(rooms);

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
        setFeaturedRooms([]);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="space-y-16 pb-6">
      <section className="overflow-hidden rounded-[40px] bg-[linear-gradient(135deg,#fff1f2_0%,#ffffff_45%,#fdf2f8_100%)] px-6 py-10 sm:px-8 md:px-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-rose-500">
              Bo suu tap cho o cho moi chuyen di
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-gray-950 md:text-6xl">
              Tim homestay phu hop, dat nhanh va theo doi lich luu tru ngay tren mot noi.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
              Tu cuoi tuan doi gio den chuyen nghi dai ngay, ban co the bat dau bang dia diem mong muon,
              chon ngay o va xem nhung can phong dang con trong.
            </p>
            <Search />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {REGION_SUGGESTIONS.slice(0, 4).map((region) => (
              <Link
                key={region.id}
                to={`/search?location=${encodeURIComponent(region.name)}`}
                className="group overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-sm"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={region.image}
                    alt={region.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-2 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold text-gray-950">{region.name}</h3>
                    <ArrowRight
                      size={18}
                      className="text-rose-500 transition group-hover:translate-x-1"
                    />
                  </div>
                  <p className="text-sm leading-6 text-gray-600">{region.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
              Goi y theo khu vuc
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950">
              Nhung vung duoc tim nhieu nhat
            </h2>
          </div>
          <Link to="/search" className="text-sm font-medium text-rose-500">
            Xem toan bo ket qua
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {REGION_SUGGESTIONS.map((region) => (
            <Link
              key={region.id}
              to={`/search?location=${encodeURIComponent(region.name)}`}
              className="rounded-[28px] border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-lg font-semibold text-gray-950">{region.name}</p>
              <p className="mt-2 text-sm leading-6 text-gray-600">{region.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
              Phong noi bat
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950">
              Danh sach goi y tu he thong
            </h2>
          </div>
          {roomTypes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {roomTypes.slice(0, 6).map((type) => (
                <Link
                  key={type}
                  to={`/search?roomType=${encodeURIComponent(type)}`}
                  className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:border-rose-200 hover:text-rose-500"
                >
                  {type}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        {error ? (
          <div className="rounded-[28px] border border-red-100 bg-red-50 p-5 text-sm text-red-600">
            Loi tai du lieu: {error}
          </div>
        ) : null}

        {!loading && !error ? (
          <div className="rounded-[20px] border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
            Backend da tra ve {featuredRooms.length} phong.
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-[28px] border border-dashed border-gray-200 p-12 text-center text-gray-500">
            Dang tai danh sach phong...
          </div>
        ) : featuredRooms.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {featuredRooms.map((room) => (
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
