import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  return (
    <div className="w-full rounded-full border border-gray-200 bg-white shadow-sm transition hover:shadow-md lg:w-auto">
      <div className="flex items-center justify-between text-sm text-gray-700 sm:text-[15px]">
        <div className="min-w-0 flex-1 border-r border-gray-200 px-4 py-3 font-semibold sm:px-6 lg:flex-none lg:px-8">
          <span className="block truncate">Dia diem VN</span>
        </div>
        <div className="hidden border-r border-gray-200 px-6 py-3 font-semibold md:block lg:px-8">
          Thoi gian
        </div>
        <div className="flex min-w-0 items-center gap-2 px-3 py-2 sm:gap-3 sm:pl-6 sm:pr-2 lg:pl-8">
          <span className="hidden whitespace-nowrap text-gray-500 md:block">
            Khach
          </span>
          <div className="rounded-full bg-rose-500 p-2 text-white sm:p-2.5">
            <SearchIcon size={16} strokeWidth={3} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
