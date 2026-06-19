import { LogOut, Menu, X, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const { logout, user, isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth?redirect=%2Fadmin");
      return;
    }

    if (!loading && user?.role !== "ADMIN") {
      navigate("/");
      return;
    }
  }, [isAuthenticated, loading, user, navigate]);

  const handleLogout = () => {
    navigate("/");
    setTimeout(() => {
      logout();
    }, 10);
  };

  const navItems = [
    { label: "Tổng quan", path: "/admin" },
    { label: "Quản lý phòng", path: "/admin/properties" },
    { label: "Quản lý đơn đặt", path: "/admin/bookings" },
    { label: "Quản lý người dùng", path: "/admin/users" },
  ];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return null; // or you could return a "Access Denied" page
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 shadow-sm transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <Link to="/admin" className="text-xl font-black text-rose-500 tracking-tight">
              AdminPanel.
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto admin-scrollbar py-6 px-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block px-4 py-3 rounded-2xl text-gray-600 font-medium hover:bg-rose-50 hover:text-rose-600 transition-all duration-200"
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-100 p-6 space-y-4">
            <div className="px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Đã đăng nhập như</p>
              <p className="font-bold text-gray-900 truncate">
                {user?.name ?? "Admin"}
              </p>
            </div>
            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 hover:bg-rose-100 rounded-2xl text-rose-600 font-bold transition-colors"
            >
              <Home size={18} />
              Về trang chủ
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-red-50 hover:text-red-600 rounded-2xl text-gray-600 font-bold transition-colors"
            >
              <LogOut size={18} />
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Quản lý HomeStay
            </h1>
            <div className="w-10" />
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
