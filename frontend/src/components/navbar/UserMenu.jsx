import { Menu, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useRef, useState } from "react";

const UserMenu = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => navigate("/search")}
        className="hidden whitespace-nowrap rounded-full px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 2xl:block"
      >
        Khám phá chỗ ở
      </button>

      {/* Dropdown Menu */}
      <div className="relative" ref={menuRef}>
        {/* Button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-3 py-2 shadow-sm transition hover:shadow-md"
        >
          <Menu size={18} className="text-gray-500" />

          <div className="rounded-full bg-gray-500 p-1 text-white">
            <User size={18} />
          </div>
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
            {isAuthenticated ? (
              <>
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm text-gray-500">Xin chào</p>
                  <p className="font-semibold text-gray-800">
                    {user?.name ?? "Người dùng"}
                  </p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-100"
                >
                  Trang cá nhân
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full px-4 py-3 text-left text-sm text-red-500 transition hover:bg-red-50"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth?mode=login"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Đăng nhập
                </Link>

                <Link
                  to="/auth?mode=register"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-100"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMenu;
