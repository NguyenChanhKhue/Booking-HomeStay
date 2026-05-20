import { Menu, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UserMenu = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => navigate("/search")}
        className="hidden rounded-full px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 md:block"
      >
        Khám phá chỗ ở
      </button>

      {isAuthenticated ? (
        <div className="flex items-center gap-2">
          <Link
            to="/profile"
            className="hidden rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-rose-200 hover:text-rose-500 sm:block"
          >
            {user?.name ?? "Tài khoản"}
          </Link>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-rose-200 hover:text-rose-500"
          >
            Đăng xuất
          </button>
        </div>
      ) : (
        <Link
          to="/auth"
          className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-rose-200 hover:text-rose-500"
        >
          Đăng nhập
        </Link>
      )}

      <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-3 py-2 shadow-sm">
        <Menu size={18} className="text-gray-500" />
        <div className="rounded-full bg-gray-500 p-1 text-white">
          <User size={18} />
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
