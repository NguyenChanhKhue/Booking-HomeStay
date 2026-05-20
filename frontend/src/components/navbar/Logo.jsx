const Logo = () => {
  return (
    <div className="flex items-center gap-2 cursor-pointer group">
      <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center shadow-md group-hover:bg-rose-600 transition">
        <span className="text-white font-black text-2xl italic">v</span>
      </div>
      <span className="text-rose-500 font-bold text-xl hidden lg:block tracking-tighter">
        vnStay
      </span>
    </div>
  );
};

export default Logo;