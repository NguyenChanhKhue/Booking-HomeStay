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
  tomorrow.getMonth() + 1
).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;

const Search = ({ compact = false, initialValues = {} }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    keyword: initialValues.keyword ?? "",
    checkInDate: initialValues.checkInDate ?? defaultCheckIn,
    checkOutDate: initialValues.checkOutDate ?? defaultCheckOut,
  });

  useEffect(() => {
    setForm({
      keyword: initialValues.keyword ?? "",
      checkInDate: initialValues.checkInDate ?? defaultCheckIn,
      checkOutDate: initialValues.checkOutDate ?? defaultCheckOut,
    });
  }, [initialValues.checkInDate, initialValues.checkOutDate, initialValues.keyword]);

  const wrapperClass = useMemo(
    () =>
      compact
        ? "rounded-full border border-gray-200 bg-white shadow-sm"
        : "rounded-[32px] border border-white/60 bg-white/95 p-3 shadow-[0_24px_70px_rgba(15,23,42,0.14)] backdrop-blur",
    [compact]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();

    if (form.keyword.trim()) params.set("keyword", form.keyword.trim());
    if (form.checkInDate) params.set("checkInDate", form.checkInDate);
    if (form.checkOutDate) params.set("checkOutDate", form.checkOutDate);

    navigate(`/search?${params.toString()}`);
  };

  if (compact) {
    return (
      <form
        className="flex h-14 w-full max-w-[820px] items-center rounded-full border border-gray-200 bg-white pl-6 pr-2 shadow-sm transition hover:shadow-md"
        onSubmit={handleSubmit}
      >
        <label className="min-w-0 flex-[1.6]">
          <span className="block text-[10px] font-semibold uppercase text-gray-500">
            Địa điểm
          </span>
          <input
            name="keyword"
            value={form.keyword}
            onChange={handleChange}
            placeholder="Bạn muốn đi đâu?"
            className="w-full border-none bg-transparent text-sm font-medium text-gray-900 outline-none placeholder:text-gray-500"
          />
        </label>
        <span className="mx-3 hidden h-8 w-px bg-gray-200 xl:block" />
        <label className="hidden w-36 xl:block">
          <span className="block text-[10px] font-semibold uppercase text-gray-500">
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
        <span className="mx-3 hidden h-8 w-px bg-gray-200 xl:block" />
        <label className="hidden w-36 xl:block">
          <span className="block text-[10px] font-semibold uppercase text-gray-500">
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
          className="ml-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white transition hover:bg-rose-600"
        >
          <SearchIcon size={16} />
        </button>
      </form>
    );
  }

  return (
    <form className={`w-full ${wrapperClass}`} onSubmit={handleSubmit}>
      <div
        className={`grid items-center gap-2 ${
          compact ? "lg:grid-cols-[1.2fr_0.9fr_0.9fr_auto]" : "md:grid-cols-4"
        }`}
      >
        <label className="block rounded-full px-4 py-3">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            Điểm đến
          </span>
          <input
            name="keyword"
            value={form.keyword}
            onChange={handleChange}
            placeholder="Bạn muốn ở khu vực nào?"
            className="w-full border-none bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />
        </label>
        <label className="block rounded-full px-4 py-3">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            Nhận phòng
          </span>
          <input
            type="date"
            name="checkInDate"
            value={form.checkInDate}
            onChange={handleChange}
            className="w-full border-none bg-transparent text-sm text-gray-900 outline-none"
          />
        </label>
        <label className="block rounded-full px-4 py-3">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            Trả phòng
          </span>
          <input
            type="date"
            name="checkOutDate"
            value={form.checkOutDate}
            onChange={handleChange}
            className="w-full border-none bg-transparent text-sm text-gray-900 outline-none"
          />
        </label>
        <button
          type="submit"
          className={`flex items-center justify-center gap-2 rounded-full bg-rose-500 font-medium text-white transition hover:bg-rose-600 ${
            compact ? "mx-2 my-2 h-12 px-5" : "h-14 px-6"
          }`}
        >
          <SearchIcon size={18} />
          <span>Tìm kiếm</span>
        </button>
      </div>
    </form>
  );
};

export default Search;
