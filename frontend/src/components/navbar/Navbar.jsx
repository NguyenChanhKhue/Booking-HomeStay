import { Search as SearchIcon } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";

const Navbar = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex max-w-[2520px] flex-row items-center justify-between gap-3 px-4 py-3 md:px-8 md:py-4 lg:px-16 xl:px-24 2xl:px-40">
        <div className="min-w-0 flex-none">
          <Logo />
        </div>
        <div className="hidden min-w-0 flex-1 justify-center px-6 md:flex">
          <Search compact />
        </div>
        <div className="flex flex-none items-center justify-end gap-2">
          <Link
            to="/search"
            aria-label="Tìm kiếm"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-rose-500 text-white transition hover:bg-rose-600 md:hidden"
          >
            <SearchIcon size={18} />
          </Link>
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
