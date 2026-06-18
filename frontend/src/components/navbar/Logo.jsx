import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      {/* Modern Text Logo */}
      <div className="flex items-center text-3xl font-black tracking-tighter text-gray-950">
        <span className="text-rose-500 transition-transform duration-300 group-hover:-translate-y-1">K</span>
        <MapPin 
          size={26} 
          strokeWidth={3} 
          className="text-rose-500 fill-rose-500 mx-[1px] transition-transform duration-300 group-hover:scale-110" 
        />
        <span className="text-gray-900 transition-transform duration-300 group-hover:translate-x-1">da</span>
      </div>
      
      <div className="hidden sm:flex flex-col ml-1 border-l-2 border-gray-200 pl-3">
        <p className="text-[13px] font-bold uppercase tracking-widest text-gray-400 leading-tight">
          Homestay
        </p>
        <p className="text-[11px] font-medium text-gray-500 leading-tight mt-[2px]">
          Nơi dừng chân lý tưởng
        </p>
      </div>
    </Link>
  );
};

export default Logo;
