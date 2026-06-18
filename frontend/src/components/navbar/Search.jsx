import { Search as SearchIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");
const defaultCheckIn = `${yyyy}-${mm}-${dd}`;

const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const defaultCheckOut = `${tomorrow.getFullYear()}-${String(
  tomorrow.getMonth() + 1,
).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;

const Search = ({ compact = false, initialValues = {} }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    location: initialValues.location ?? initialValues.keyword ?? "",
    checkInDate: initialValues.checkInDate ?? defaultCheckIn,
    checkOutDate: initialValues.checkOutDate ?? defaultCheckOut,
    maxPrice: initialValues.maxPrice ?? 5000000,
  });

  useEffect(() => {
    setForm({
      location: initialValues.location ?? initialValues.keyword ?? "",
      checkInDate: initialValues.checkInDate ?? defaultCheckIn,
      checkOutDate: initialValues.checkOutDate ?? defaultCheckOut,
      maxPrice: initialValues.maxPrice ?? 5000000,
    });
  }, [
    initialValues.checkInDate,
    initialValues.checkOutDate,
    initialValues.keyword,
    initialValues.location,
    initialValues.maxPrice,
  ]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();

    if (form.location.trim()) params.set("location", form.location.trim());
    if (form.checkInDate) params.set("checkInDate", form.checkInDate);
    if (form.checkOutDate) params.set("checkOutDate", form.checkOutDate);
    if (form.maxPrice < 5000000) {
      params.set("minPrice", "0");
      params.set("maxPrice", form.maxPrice.toString());
    }

    navigate(`/search?${params.toString()}`);
  };

  // Compact version for mobile / other pages
  if (compact) {
    return (
      <form
        className="flex h-12 w-full max-w-[700px] items-center rounded-full border border-gray-200 bg-white pl-5 pr-1.5 shadow-sm transition hover:shadow-md"
        onSubmit={handleSubmit}
      >
        <label className="min-w-0 flex-[1.6]">
          <span className="block text-[9px] font-bold uppercase text-gray-500">
            Địa điểm
          </span>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Bạn muốn đi đâu?"
            className="w-full border-none bg-transparent text-xs font-medium text-gray-900 outline-none placeholder:text-gray-400"
          />
        </label>
        <span className="mx-2 hidden h-7 w-px bg-gray-200 xl:block" />
        <label className="hidden w-28 xl:block">
          <span className="block text-[9px] font-bold uppercase text-gray-500">
            Nhận phòng
          </span>
          <input
            type="date"
            name="checkInDate"
            value={form.checkInDate}
            onChange={handleChange}
            className="w-full border-none bg-transparent text-xs font-medium text-gray-900 outline-none"
          />
        </label>
        <span className="mx-2 hidden h-7 w-px bg-gray-200 xl:block" />
        <label className="hidden w-28 xl:block">
          <span className="block text-[9px] font-bold uppercase text-gray-500">
            Trả phòng
          </span>
          <input
            type="date"
            name="checkOutDate"
            value={form.checkOutDate}
            onChange={handleChange}
            className="w-full border-none bg-transparent text-xs font-medium text-gray-900 outline-none"
          />
        </label>
        <button
          type="submit"
          aria-label="Tìm kiếm"
          className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white transition hover:bg-rose-600"
        >
          <SearchIcon size={14} />
        </button>
      </form>
    );
  }

  const formatPriceLabel = (price) => {
    if (price >= 5000000) return "Tất cả";
    if (price >= 1000000) return `${(price / 1000000).toFixed(1)}tr đ`;
    return `${(price / 1000).toFixed(0)}k đ`;
  };

  const pct = ((form.maxPrice - 500000) / (5000000 - 500000)) * 100;

  return (
    <form
      className="mx-auto w-full max-w-3xl rounded-full border border-white/60 bg-white/95 px-2 py-1.5 shadow-[0_16px_48px_rgba(0,0,0,0.12)] backdrop-blur-xl"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-gray-200">

        {/* Địa điểm */}
        <label className="w-full flex-[1.4] px-3 py-1.5 hover:bg-gray-50/60 rounded-full transition-colors cursor-text">
          <span className="block text-[9px] font-extrabold uppercase tracking-widest text-gray-900 mb-0.5">
            Địa điểm
          </span>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Bạn muốn ở khu vực nào?"
            className="w-full border-none bg-transparent text-xs text-gray-600 outline-none placeholder:text-gray-400 font-medium"
          />
        </label>

        {/* Nhận phòng */}
        <label className="w-full flex-1 px-3 py-1.5 hover:bg-gray-50/60 rounded-full transition-colors cursor-pointer">
          <span className="block text-[9px] font-extrabold uppercase tracking-widest text-gray-900 mb-0.5">
            Nhận phòng
          </span>
          <input
            type="date"
            name="checkInDate"
            value={form.checkInDate}
            onChange={handleChange}
            className="w-full border-none bg-transparent text-xs text-gray-600 outline-none font-medium cursor-pointer"
          />
        </label>

        {/* Trả phòng */}
        <label className="w-full flex-1 px-3 py-1.5 hover:bg-gray-50/60 rounded-full transition-colors cursor-pointer">
          <span className="block text-[9px] font-extrabold uppercase tracking-widest text-gray-900 mb-0.5">
            Trả phòng
          </span>
          <input
            type="date"
            name="checkOutDate"
            value={form.checkOutDate}
            onChange={handleChange}
            className="w-full border-none bg-transparent text-xs text-gray-600 outline-none font-medium cursor-pointer"
          />
        </label>

        {/* Mức giá - Slider */}
        <label className="w-full flex-[1.2] px-3 py-1.5 hover:bg-gray-50/60 rounded-full transition-colors cursor-pointer">
          <span className="flex items-center justify-between text-[9px] font-extrabold uppercase tracking-widest text-gray-900 mb-0.5">
            Mức giá:&nbsp;
            <span className="font-black normal-case text-[12px] text-rose-500">
              {formatPriceLabel(form.maxPrice)}
            </span>
          </span>
          <div className="flex items-center h-2.5">
            <input
              type="range"
              name="maxPrice"
              min="500000"
              max="5000000"
              step="500000"
              value={form.maxPrice}
              onChange={handleChange}
              className="w-full h-1 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #f43f5e ${pct}%, #e5e7eb ${pct}%)`,
              }}
            />
          </div>
        </label>

        {/* Nút Tìm kiếm */}
        <div className="px-1.5 py-1 w-full md:w-auto">
          <button
            type="submit"
            className="flex h-10 w-full md:w-auto items-center justify-center gap-1.5 rounded-full bg-rose-500 px-5 font-bold text-sm text-white transition-all hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/30 hover:scale-105 shrink-0"
          >
            <SearchIcon size={15} />
            <span>Tìm kiếm</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default Search;
