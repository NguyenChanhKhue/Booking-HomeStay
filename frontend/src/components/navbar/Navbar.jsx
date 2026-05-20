import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";

const Navbar = () => {
  return (
    <header className="fixed w-full bg-white z-50 border-b border-gray-100 shadow-sm">
      {/* Đổi từ px-20 lên px-24 để chừa lề rộng hơn giống mẫu */}
      <div className="max-w-[2520px] mx-auto xl:px-24 md:px-10 sm:px-4 px-4 py-4 md:py-5">
        <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
          <div className="flex-1 flex justify-start">
            <Logo />
          </div>
          <div className="flex-none">
            <Search />
          </div>
          <div className="flex-1 flex justify-end">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;