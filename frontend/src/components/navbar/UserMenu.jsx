import { Menu, User } from 'lucide-react';

const UserMenu = () => {
  return (
    <div className="flex items-center gap-3">
      {/* Nút này chỉ hiện trên màn hình lớn để tối giản cho mobile */}
      <div className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-gray-50 transition cursor-pointer text-gray-700">
        Cho thuê chỗ ở
      </div>
      
      <div className="p-2 md:px-3 md:py-1 border border-gray-200 flex items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition bg-white">
        <Menu size={18} className="text-gray-600" />
        <div className="bg-gray-500 rounded-full p-1 border border-gray-100">
          <User size={20} className="text-white" fill="currentColor" />
        </div>
      </div>
    </div>
  );
};

export default UserMenu;