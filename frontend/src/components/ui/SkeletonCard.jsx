const SkeletonCard = () => {
  return (
    <div className="h-full flex flex-col overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-sm">
      <div className="relative aspect-[4/3] bg-gray-200 animate-pulse"></div>
      
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-6 w-3/4 rounded-md bg-gray-200 animate-pulse"></div>
            <div className="h-4 w-1/2 rounded-md bg-gray-200 animate-pulse"></div>
            <div className="mt-2 space-y-1">
              <div className="h-3 w-full rounded-md bg-gray-200 animate-pulse"></div>
              <div className="h-3 w-4/5 rounded-md bg-gray-200 animate-pulse"></div>
            </div>
          </div>
          <div className="h-6 w-12 shrink-0 rounded-full bg-gray-200 animate-pulse"></div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-gray-100 pt-5">
          <div className="space-y-1">
            <div className="h-3 w-16 rounded-md bg-gray-200 animate-pulse"></div>
            <div className="h-6 w-24 rounded-md bg-gray-200 animate-pulse"></div>
          </div>
          <div className="h-10 w-28 shrink-0 rounded-full bg-gray-200 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
