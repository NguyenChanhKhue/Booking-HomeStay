import { Search as SearchIcon, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/about", label: "Giới thiệu" },
    { path: "/contact", label: "Liên hệ" },
    { path: "/search", label: "Khám phá chỗ ở" },
  ];

  return (
    <header 
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "border-b border-gray-200/50 bg-white/90 shadow-sm backdrop-blur-md py-2" 
          : "bg-white py-2.5"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[2520px] flex-row items-center justify-between px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-40">
        
        {/* Nhóm 1: Cụm bên trái (Branding) */}
        <div className="flex items-center gap-3 min-w-0 flex-none">
          <Logo />
        </div>

        {/* Nhóm 2: Cụm bên phải (Navigation & User) */}
        <div className="flex items-center gap-8 lg:gap-12">
          
          {/* Phần Menu điều hướng */}
          <div className="hidden md:flex items-center gap-1 text-sm font-semibold">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${
                    isActive 
                      ? "bg-rose-50 text-rose-600" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-rose-500"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Phần User & Mobile */}
          <div className="flex items-center gap-2">
            <Link
              to="/search"
              aria-label="Tìm kiếm"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-white transition hover:bg-rose-600 md:hidden"
            >
              <SearchIcon size={16} />
            </Link>
            
            <UserMenu />

            <button 
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg py-4 px-6 flex flex-col gap-2 z-40">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.path}
                to={link.path} 
                onClick={() => setMobileMenuOpen(false)} 
                className={`text-base font-semibold px-4 py-3 rounded-xl transition ${
                  isActive ? "bg-rose-50 text-rose-600" : "text-gray-800 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Navbar;
