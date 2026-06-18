import { Lock, Unlock, Shield, ShieldAlert, Mail, Phone, Trash2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { deleteUserAdmin, getAllUsersAdmin, toggleUserStatusAdmin, changeUserRoleAdmin } from "../../services/adminService";

const AdminUsers = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth?redirect=%2Fadmin%2Fusers");
      return;
    }

    if (!loading && user?.role !== "ADMIN") {
      navigate("/");
      return;
    }
  }, [isAuthenticated, loading, user, navigate]);

  useEffect(() => {
    const loadUsers = async () => {
      if (!token || user?.role !== "ADMIN") return;
      try {
        const data = await getAllUsersAdmin(token);
        setUsers(data);
      } catch (error) {
        console.error("Failed to load users:", error);
        setMessage("Không thể tải danh sách người dùng");
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, [token, user]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    if (userId === user?.id) {
      setMessage("Không thể xóa tài khoản admin của chính bạn");
      return;
    }

    try {
      await deleteUserAdmin(userId, token);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setMessage("Xóa người dùng thành công!");
      setSelectedUser(null);
    } catch (error) {
      setMessage(error.response?.data?.message || "Không thể xóa người dùng");
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    if (!window.confirm(`Bạn có chắc muốn ${currentStatus ? "khóa" : "mở khóa"} người dùng này?`)) return;
    try {
      await toggleUserStatusAdmin(userId, token);
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, isActive: !u.isActive } : u));
      setMessage(`${currentStatus ? "Khóa" : "Mở khóa"} người dùng thành công!`);
    } catch (error) {
      setMessage(error.response?.data?.message || `Không thể ${currentStatus ? "khóa" : "mở khóa"} người dùng`);
    }
  };

  const handleChangeRole = async (userId, currentRole) => {
    if (!window.confirm(`Bạn có chắc muốn cấp quyền ${currentRole === "ADMIN" ? "Khách hàng" : "Quản trị viên"} cho người dùng này?`)) return;
    try {
      await changeUserRoleAdmin(userId, token);
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: currentRole === "ADMIN" ? "CUSTOMER" : "ADMIN" } : u));
      setMessage("Cập nhật vai trò thành công!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Không thể cập nhật vai trò người dùng");
    }
  };

  if (loading || loadingUsers) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Quản lý người dùng</h1>
        <p className="text-gray-600 mt-2">
          Tổng cộng {users.length} người dùng
        </p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`px-6 py-4 rounded-lg ${
            message.includes("Không thể") || message.includes("lỗi")
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((userItem) => (
          <div
            key={userItem.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 rounded-full">
                    <User size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      {userItem.name}
                      {userItem.isActive === false && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-full uppercase">Đã khóa</span>
                      )}
                    </h3>
                    <p className="text-xs text-gray-600 font-medium">
                      {userItem.role === "ADMIN"
                        ? <span className="text-rose-600">Quản trị viên</span>
                        : "Khách hàng"}
                    </p>
                  </div>
                </div>
                {userItem.id !== user?.id && (
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleToggleStatus(userItem.id, userItem.isActive !== false)}
                      className={`p-2 rounded-lg transition flex justify-center ${userItem.isActive === false ? 'text-green-600 hover:bg-green-50' : 'text-orange-500 hover:bg-orange-50'}`}
                      title={userItem.isActive === false ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                    >
                      {userItem.isActive === false ? <Unlock size={18} /> : <Lock size={18} />}
                    </button>
                    <button
                      onClick={() => handleChangeRole(userItem.id, userItem.role)}
                      className={`p-2 rounded-lg transition flex justify-center ${userItem.role === 'ADMIN' ? 'text-gray-600 hover:bg-gray-100' : 'text-blue-600 hover:bg-blue-50'}`}
                      title={userItem.role === 'ADMIN' ? "Giáng cấp thành Khách hàng" : "Cấp quyền Quản trị viên"}
                    >
                      {userItem.role === 'ADMIN' ? <ShieldAlert size={18} /> : <Shield size={18} />}
                    </button>
                    {userItem.role !== "ADMIN" && (
                      <button
                        onClick={() => handleDeleteUser(userItem.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition flex justify-center"
                        title="Xóa người dùng"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="text-sm font-medium text-gray-900 break-all">
                      {userItem.email}
                    </p>
                  </div>
                </div>

                {userItem.phoneNumber && (
                  <div className="flex items-start gap-3">
                    <Phone size={16} className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-xs text-gray-600">Số điện thoại</p>
                      <p className="text-sm font-medium text-gray-900">
                        {userItem.phoneNumber}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() =>
                  setSelectedUser(
                    selectedUser?.id === userItem.id ? null : userItem,
                  )
                }
                className="w-full text-rose-500 hover:text-rose-600 text-sm font-medium py-2"
              >
                {selectedUser?.id === userItem.id
                  ? "Ẩn chi tiết"
                  : "Xem chi tiết"}
              </button>

              {selectedUser?.id === userItem.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                  <div>
                    <p className="text-xs text-gray-600">Tên đầy đủ</p>
                    <p className="text-sm font-medium text-gray-900">
                      {userItem.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="text-sm font-medium text-gray-900">
                      {userItem.email}
                    </p>
                  </div>
                  {userItem.phoneNumber && (
                    <div>
                      <p className="text-xs text-gray-600">Số điện thoại</p>
                      <p className="text-sm font-medium text-gray-900">
                        {userItem.phoneNumber}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-600">Vai trò</p>
                    <p className="text-sm font-medium text-gray-900">
                      {userItem.role === "ADMIN"
                        ? "Quản trị viên"
                        : "Khách hàng"}
                    </p>
                  </div>
                  {userItem.bookings && (
                    <div>
                      <p className="text-xs text-gray-600">Số đơn đặt</p>
                      <p className="text-sm font-medium text-gray-900">
                        {userItem.bookings.length}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
          <User size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-lg">Chưa có người dùng nào</p>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
