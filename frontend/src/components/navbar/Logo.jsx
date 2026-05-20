import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500 text-lg font-black uppercase text-white shadow-sm">
        B
      </div>
      <div className="hidden sm:block">
        <p className="text-lg font-semibold tracking-tight text-rose-500">
          Booking HomeStay
        </p>
        <p className="text-xs text-gray-500">Ở đúng chỗ, nghỉ đúng gu</p>
      </div>
    </Link>
  );
};

export default Logo;
