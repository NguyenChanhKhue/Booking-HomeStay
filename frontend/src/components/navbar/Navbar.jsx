import { Search as SearchIcon } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";

const Navbar = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex w-full max-w-[2520px] flex-row items-center justify-between px-4 py-3 md:px-8 lg:px-16 xl:px-24 2xl:px-40">
        {/* Logo */}
        <div className="min-w-0 flex-none">
          <Logo />
        </div>

        {/* Right side: links + actions grouped tightly */}
        <div className="flex items-center gap-1">
          <div className="hidden md:flex items-center gap-1 text-sm font-semibold text-gray-600">
            <Link to="/about" className="px-4 py-2 rounded-full hover:bg-gray-100 hover:text-rose-500 transition">Giới Thiệu</Link>
            <Link to="/contact" className="px-4 py-2 rounded-full hover:bg-gray-100 hover:text-rose-500 transition">Liên hệ</Link>
          </div>
          <Link
            to="/search"
            aria-label="Tìm kiếm"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-white transition hover:bg-rose-600 md:hidden"
          >
            <SearchIcon size={16} />
          </Link>
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
