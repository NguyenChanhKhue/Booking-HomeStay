import { SearchX } from "lucide-react";

const EmptyState = ({ onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-[32px] border border-dashed border-gray-200 bg-gray-50/50 py-16 px-6 text-center">
      <div className="rounded-full bg-white p-4 shadow-sm mb-4">
        <SearchX size={32} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">Không tìm thấy chỗ ở nào</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">
        Rất tiếc, hiện tại không có homestay nào phù hợp với tìm kiếm của bạn. Hãy thử thay đổi bộ lọc hoặc xem các địa điểm khác nhé.
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="rounded-full bg-rose-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600 hover:shadow-md"
        >
          Xóa bộ lọc / Tìm lại
        </button>
      )}
    </div>
  );
};

export default EmptyState;
