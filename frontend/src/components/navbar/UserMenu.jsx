import { Menu, User, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    setOpen(false);
    navigate("/");
    setTimeout(() => {
      logout();
    }, 10);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Dropdown Menu */}
      <div className="relative" ref={menuRef}>
        {/* Button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white p-1.5 shadow-sm transition hover:shadow-md hover:bg-gray-50"
        >
          <div className="rounded-full bg-gray-500 p-1.5 text-white">
            <User size={18} />
          </div>
          <ChevronDown size={14} className="text-gray-500 mr-1" />
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div 
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_10px_40px_rgb(0,0,0,0.1)]"
            >
              {isAuthenticated ? (
                <>
                  <div className="border-b border-gray-100 px-4 py-3 bg-gray-50/50">
                    <p className="text-sm text-gray-500">Xin chào</p>
                    <p className="font-semibold text-gray-800">
                      {user?.name ?? "Người dùng"}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-rose-50 hover:text-rose-600"
                  >
                    Trang cá nhân
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full px-4 py-3 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth?mode=login"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-rose-600"
                  >
                    Đăng nhập
                  </Link>

                  <Link
                    to="/auth?mode=register"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-rose-600"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserMenu;
