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
    location: initialValues.location ?? initialValues.keyword ?? "",
    checkInDate: initialValues.checkInDate ?? defaultCheckIn,
    checkOutDate: initialValues.checkOutDate ?? defaultCheckOut,
  });

  useEffect(() => {
    setForm({
      location: initialValues.location ?? initialValues.keyword ?? "",
      checkInDate: initialValues.checkInDate ?? defaultCheckIn,
      checkOutDate: initialValues.checkOutDate ?? defaultCheckOut,
    });
  }, [initialValues.checkInDate, initialValues.checkOutDate, initialValues.keyword, initialValues.location]);

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

    if (form.location.trim()) params.set("location", form.location.trim());
    if (form.checkInDate) params.set("checkInDate", form.checkInDate);
    if (form.checkOutDate) params.set("checkOutDate", form.checkOutDate);

    navigate(`/search?${params.toString()}`);
  };

  return (
    <form className={`w-full ${wrapperClass}`} onSubmit={handleSubmit}>
      <div
        className={`grid items-center gap-2 ${
          compact ? "lg:grid-cols-[1.2fr_0.9fr_0.9fr_auto]" : "md:grid-cols-4"
        }`}
      >
        <label className="block rounded-full px-4 py-3">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            Dia diem
          </span>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Ban muon o khu vuc nao?"
            className="w-full border-none bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />
        </label>
        <label className="block rounded-full px-4 py-3">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            Nhan phong
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
            Tra phong
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
          <span>Tim kiem</span>
        </button>
      </div>
    </form>
  );
};

export default Search;
