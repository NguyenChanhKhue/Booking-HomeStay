import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
  return (
    <div className="border-[1px] py-3 rounded-full shadow-sm hover:shadow-md transition cursor-pointer bg-white">
      <div className="flex flex-row items-center justify-between text-[15px]">
        {/* Tăng px lên 8 và font-semibold cho chữ rõ ràng */}
        <div className="font-semibold px-8 border-r border-gray-200">Địa điểm VN</div>
        <div className="hidden sm:block font-semibold px-8 border-r border-gray-200">Thời gian</div>
        <div className="flex items-center gap-3 pl-8 pr-2">
          <span className="hidden md:block text-gray-500 font-medium">Khách</span>
          <div className="bg-rose-500 p-2.5 rounded-full text-white">
            <SearchIcon size={18} strokeWidth={3} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;