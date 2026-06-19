import { Search as SearchIcon, Filter } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import { AMENITIES_LIST } from "../../utils/constants";

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

const Search = ({ compact = false, fullWidth = false, initialValues = {} }) => {
  const navigate = useNavigate();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [form, setForm] = useState({
    location: initialValues.location ?? initialValues.keyword ?? "",
    checkInDate: initialValues.checkInDate ?? defaultCheckIn,
    checkOutDate: initialValues.checkOutDate ?? defaultCheckOut,
    roomType: initialValues.roomType ?? "",
    minPrice: initialValues.minPrice ? Number(initialValues.minPrice) : 0,
    maxPrice: initialValues.maxPrice ? Number(initialValues.maxPrice) : 5000000,
    amenities: initialValues.amenities ? initialValues.amenities.split(',') : [],
  });

  useEffect(() => {
    setForm({
      location: initialValues.location ?? initialValues.keyword ?? "",
      checkInDate: initialValues.checkInDate ?? defaultCheckIn,
      checkOutDate: initialValues.checkOutDate ?? defaultCheckOut,
      roomType: initialValues.roomType ?? "",
      minPrice: initialValues.minPrice ? Number(initialValues.minPrice) : 0,
      maxPrice: initialValues.maxPrice ? Number(initialValues.maxPrice) : 5000000,
      amenities: initialValues.amenities ? initialValues.amenities.split(',') : [],
    });
  }, [
    initialValues.checkInDate,
    initialValues.checkOutDate,
    initialValues.keyword,
    initialValues.location,
    initialValues.roomType,
    initialValues.minPrice,
    initialValues.maxPrice,
    initialValues.amenities,
  ]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (form.checkInDate && form.checkOutDate) {
      if (new Date(form.checkOutDate) <= new Date(form.checkInDate)) {
        alert("Ngày trả phòng phải sau Ngày nhận phòng");
        return;
      }
    }
    const params = new URLSearchParams();

    if (form.location.trim()) params.set("location", form.location.trim());
    if (form.checkInDate) params.set("checkInDate", form.checkInDate);
    if (form.checkOutDate) params.set("checkOutDate", form.checkOutDate);
    if (form.roomType) params.set("roomType", form.roomType);
    if (form.minPrice > 0) params.set("minPrice", form.minPrice.toString());
    if (form.maxPrice < 5000000) params.set("maxPrice", form.maxPrice.toString());
    if (form.amenities.length > 0) params.set("amenities", form.amenities.join(','));

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
            min={defaultCheckIn}
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
            min={form.checkInDate || defaultCheckIn}
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
    const numPrice = Number(price) || 0;
    return numPrice.toLocaleString('vi-VN') + 'đ';
  };

  return (
    <div className={`mx-auto w-full ${fullWidth ? 'max-w-none' : 'max-w-[880px]'}`}>
      <form
        className={`w-full transition-all duration-300 border border-gray-200 bg-white/95 shadow-[0_16px_48px_rgba(0,0,0,0.06)] backdrop-blur-xl ${
          showAdvanced ? 'rounded-[32px] px-2 py-2' : 'rounded-full px-2 py-1'
        }`}
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
          
          {/* Địa điểm */}
          <label className="w-full flex-[1.4] px-4 py-1.5 hover:bg-gray-50/60 rounded-full transition-colors cursor-text">
            <span className="block text-[9px] font-extrabold uppercase tracking-widest text-gray-900 mb-0">
              Địa điểm
            </span>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Bạn muốn ở khu vực nào?"
              className="w-full border-none bg-transparent text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
            />
          </label>

          {/* Nhận phòng */}
          <label className="w-full flex-1 px-4 py-1.5 hover:bg-gray-50/60 rounded-full transition-colors cursor-pointer">
            <span className="block text-[9px] font-extrabold uppercase tracking-widest text-gray-900 mb-0">
              Nhận phòng
            </span>
            <input
              type="date"
              name="checkInDate"
              value={form.checkInDate}
              min={defaultCheckIn}
              onChange={handleChange}
              className="w-full border-none bg-transparent text-sm font-medium text-gray-900 outline-none cursor-pointer"
            />
          </label>

          {/* Trả phòng */}
          <label className="w-full flex-1 px-4 py-1.5 hover:bg-gray-50/60 rounded-full transition-colors cursor-pointer">
            <span className="block text-[9px] font-extrabold uppercase tracking-widest text-gray-900 mb-0">
              Trả phòng
            </span>
            <input
              type="date"
              name="checkOutDate"
              value={form.checkOutDate}
              min={form.checkInDate || defaultCheckIn}
              onChange={handleChange}
              className="w-full border-none bg-transparent text-sm font-medium text-gray-900 outline-none cursor-pointer"
            />
          </label>

          {/* Mức giá - Slider */}
          <div className="w-full min-w-[200px] flex-[1.6] px-4 py-1.5 hover:bg-gray-50/60 rounded-full transition-colors flex flex-col justify-center">
            <span className="flex items-center justify-between text-[9px] font-extrabold uppercase tracking-widest text-gray-900 mb-1">
              Mức giá:
              <span className="font-black normal-case text-xs text-gray-700 tracking-normal whitespace-nowrap ml-1">
                {formatPriceLabel(form.minPrice)} - {formatPriceLabel(form.maxPrice)}
              </span>
            </span>
            <div className="flex items-center h-4 px-2 w-full">
              <Slider
                range
                min={0}
                max={5000000}
                step={100000}
                value={[form.minPrice, form.maxPrice]}
                onChange={(val) => setForm((prev) => ({ ...prev, minPrice: val[0], maxPrice: val[1] }))}
                trackStyle={[{ backgroundColor: '#f43f5e', height: 4 }]}
                handleStyle={[
                  { borderColor: '#f43f5e', backgroundColor: 'white', opacity: 1, height: 14, width: 14, marginTop: -5 },
                  { borderColor: '#f43f5e', backgroundColor: 'white', opacity: 1, height: 14, width: 14, marginTop: -5 }
                ]}
                railStyle={{ backgroundColor: '#e5e7eb', height: 4 }}
              />
            </div>
          </div>

          {/* Nút Tìm kiếm & Toggle Filter */}
          <div className="px-1.5 py-1 w-full md:w-auto flex items-center justify-end gap-1.5 shrink-0">
            <button
              type="button"
              title="Bộ lọc nâng cao"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-all shrink-0 ${
                showAdvanced ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Filter size={14} />
            </button>
            <button
              type="submit"
              className="flex h-10 w-full md:w-auto items-center justify-center gap-1.5 rounded-full bg-rose-500 px-5 font-bold text-sm text-white transition-all hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/30 hover:scale-105 shrink-0"
            >
              <SearchIcon size={15} />
              <span className="hidden md:inline">Tìm kiếm</span>
            </button>
          </div>
        </div>

        {/* Tiện nghi & Loại phòng - Advanced Filters */}
        {showAdvanced && (
          <div className="px-6 pb-6 pt-5 border-t border-gray-100 mt-2">
            <div className="mb-6">
              <span className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-900 mb-4">
                Loại phòng
              </span>
              <select
                name="roomType"
                value={form.roomType}
                onChange={handleChange}
                className="w-full md:w-1/3 border border-gray-200 text-sm font-medium text-gray-700 rounded-lg px-3 py-2 outline-none focus:border-rose-300"
              >
                <option value="">Tất cả loại phòng</option>
                <option value="Single Room">Single Room</option>
                <option value="Double Room">Double Room</option>
                <option value="Family Room">Family Room</option>
                <option value="Deluxe Room">Deluxe Room</option>
                <option value="Suite Room">Suite Room</option>
                <option value="Studio Room">Studio Room</option>
                <option value="VIP Room">VIP Room</option>
              </select>
            </div>
            
            <span className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-900 mb-4">
              Lọc theo tiện nghi
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {AMENITIES_LIST.map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer hover:text-rose-600 transition-colors">
                  <input
                    type="checkbox"
                    checked={form.amenities.includes(amenity)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setForm((prev) => ({ ...prev, amenities: [...prev.amenities, amenity] }));
                      } else {
                        setForm((prev) => ({ ...prev, amenities: prev.amenities.filter((a) => a !== amenity) }));
                      }
                    }}
                    className="rounded border-gray-300 text-rose-500 focus:ring-rose-500 h-4 w-4"
                  />
                  <span className="font-medium">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Search;
