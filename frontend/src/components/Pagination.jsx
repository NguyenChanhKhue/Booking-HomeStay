import React from "react";

const Pagination = ({ currentPage, totalPages, paginate }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-8 gap-2">
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
      >
        Trang trước
      </button>
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i + 1}
          onClick={() => paginate(i + 1)}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
            currentPage === i + 1
              ? "bg-rose-500 text-white font-bold"
              : "border border-gray-200 hover:bg-gray-50 text-gray-700"
          }`}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
      >
        Trang sau
      </button>
    </div>
  );
};

export default Pagination;
