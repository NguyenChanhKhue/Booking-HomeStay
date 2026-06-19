import { Edit2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  createRoom,
  deleteRoomAdmin,
  getAllRoomsAdmin,
  updateRoomAdmin,
} from "../../services/adminService";
import { formatPrice } from "../../utils/formatPrice";
import { AMENITIES_LIST } from "../../utils/constants";

const AdminProperties = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, token } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    roomType: "",
    roomLocation: "",
    roomPrice: "",
    description: "",
    photo: null,
    additionalPhotos: [],
    amenities: [],
  });



  useEffect(() => {
    const loadRooms = async () => {
      if (!token || user?.role !== "ADMIN") return;
      try {
        const data = await getAllRoomsAdmin(token);
        setRooms(data);
      } catch (error) {
        console.error("Failed to load rooms:", error);
        setMessage("Không thể tải danh sách phòng");
      } finally {
        setLoadingRooms(false);
      }
    };

    loadRooms();
  }, [token, user]);

  const handleOpenModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        roomType: room.roomType,
        roomLocation: room.roomLocation,
        roomPrice: room.roomPrice,
        description: room.roomDescription,
        photo: null,
        additionalPhotos: [],
        amenities: room.amenities || [],
      });
    } else {
      setEditingRoom(null);
      setFormData({
        roomType: "",
        roomLocation: "",
        roomPrice: "",
        description: "",
        photo: null,
        additionalPhotos: [],
        amenities: [],
      });
    }
    setMessage("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRoom(null);
    setMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo: file,
      }));
    }
  };

  const handleAdditionalFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      additionalPhotos: files.slice(0, 4), // max 4 additional images + 1 main = 5
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData((prev) => {
      const isChecked = prev.amenities.includes(amenity);
      if (isChecked) {
        return { ...prev, amenities: prev.amenities.filter((a) => a !== amenity) };
      } else {
        return { ...prev, amenities: [...prev.amenities, amenity] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    // Validate required fields
    if (!formData.roomType.trim()) {
      setMessage("Vui lòng nhập loại phòng");
      setSubmitting(false);
      return;
    }
    if (!formData.roomLocation.trim()) {
      setMessage("Vui lòng nhập địa điểm");
      setSubmitting(false);
      return;
    }
    if (!formData.roomPrice || formData.roomPrice <= 0) {
      setMessage("Vui lòng nhập giá phòng hợp lệ");
      setSubmitting(false);
      return;
    }
    if (!formData.description.trim()) {
      setMessage("Vui lòng nhập mô tả");
      setSubmitting(false);
      return;
    }
    if (!editingRoom && !formData.photo) {
      setMessage("Vui lòng chọn ảnh cho phòng mới");
      setSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("roomType", formData.roomType.trim());
      data.append("roomLocation", formData.roomLocation.trim());
      data.append("roomPrice", formData.roomPrice);
      data.append("description", formData.description.trim());
      if (formData.photo) {
        data.append("photo", formData.photo);
      }
      if (formData.additionalPhotos && formData.additionalPhotos.length > 0) {
        formData.additionalPhotos.forEach((file) => {
          data.append("additionalPhotos", file);
        });
      }
      if (formData.amenities && formData.amenities.length > 0) {
        data.append("amenities", formData.amenities.join(','));
      }

      if (editingRoom) {
        await updateRoomAdmin(editingRoom.id, data, token);
        setMessage("✓ Cập nhật phòng thành công!");
      } else {
        await createRoom(data, token);
        setMessage("✓ Thêm phòng thành công!");
      }

      // Reload rooms
      const updatedRooms = await getAllRoomsAdmin(token);
      setRooms(updatedRooms);
      setTimeout(() => {
        setShowModal(false);
        setEditingRoom(null);
      }, 1000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || error.message || "Có lỗi xảy ra";
      setMessage("❌ " + errorMsg);
      console.error("Create/Update room error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm("Bạn có chắc muốn xóa phòng này?")) return;

    try {
      await deleteRoomAdmin(roomId, token);
      setRooms((prev) => prev.filter((r) => r.id !== roomId));
      setMessage("Xóa phòng thành công!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Không thể xóa phòng");
    }
  };

  if (loading || loadingRooms) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Quản lý phòng</h1>
          <p className="text-gray-600 mt-2">Tổng cộng {rooms.length} phòng</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg transition"
        >
          <Plus size={20} />
          Thêm phòng mới
        </button>
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

      {/* Rooms Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Loại phòng
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Địa điểm
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {room.roomType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {room.roomLocation}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-rose-500">
                    {formatPrice(room.roomPrice)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">
                    {room.roomDescription}
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => handleOpenModal(room)}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 rounded transition"
                    >
                      <Edit2 size={16} />
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded transition"
                    >
                      <Trash2 size={16} />
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rooms.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <Home size={48} className="mx-auto mb-4 text-gray-400" />
            <p>Chưa có phòng nào</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingRoom ? "Sửa phòng" : "Thêm phòng mới"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại phòng *
                </label>
                <input
                  type="text"
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa điểm *
                </label>
                <input
                  type="text"
                  name="roomLocation"
                  value={formData.roomLocation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá (VND) *
                </label>
                <input
                  type="number"
                  name="roomPrice"
                  value={formData.roomPrice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hình ảnh {editingRoom ? "(tùy chọn)" : "*bắt buộc"}
                  {editingRoom ? null : (
                    <span className="text-red-500"> *</span>
                  )}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                  required={!editingRoom}
                />
                {formData.photo ? (
                  <p className="mt-2 text-sm text-green-600">
                    ✓ Tệp chính: {formData.photo.name}
                  </p>
                ) : editingRoom ? (
                  <p className="mt-2 text-sm text-gray-500">
                    Không upload file = giữ nguyên ảnh cũ
                  </p>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hình ảnh phụ (Tối đa 4 ảnh)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAdditionalFilesChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                />
                {formData.additionalPhotos && formData.additionalPhotos.length > 0 && (
                  <p className="mt-2 text-sm text-green-600">
                    ✓ Đã chọn {formData.additionalPhotos.length} ảnh phụ.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiện nghi phòng
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {AMENITIES_LIST.map((amenity) => (
                    <label key={amenity} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.amenities?.includes(amenity) || false}
                        onChange={() => handleAmenityChange(amenity)}
                        className="rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                      />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-rose-500 hover:bg-rose-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
                >
                  {submitting
                    ? "Đang xử lý..."
                    : editingRoom
                      ? "Cập nhật"
                      : "Thêm"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProperties;
