import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";

const Navbar = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex max-w-[2520px] items-center justify-between gap-3 px-4 py-3 sm:px-4 md:px-8 md:py-4 xl:px-24">
        <div className="min-w-0 flex-1">
          <Logo />
        </div>
        <div className="hidden min-w-0 flex-none lg:block">
          <Search compact />
        </div>
        <div className="flex flex-1 justify-end">
          <UserMenu />
        </div>
      </div>
      <div className="mx-auto w-full max-w-[2520px] px-4 pb-3 lg:hidden sm:px-4 md:px-8 xl:px-24">
        <Search compact />
      </div>
    </header>
  );
};

export default Navbar;
