import { useState } from "react";
import { resetPassword, requestPasswordReset } from "../services/authService";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Gửi OTP, 2: Đặt lại mật khẩu
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async () => {
    setLoading(true);
    setError("");
    try {
      await requestPasswordReset(email);
      setStep(2);
    } catch (err) {
      setError("Không thể gửi OTP. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    setError("");
    try {
      await resetPassword(email, otp, newPassword);
      onClose();
      alert("Đặt lại mật khẩu thành công!");
    } catch (err) {
      setError("Không thể đặt lại mật khẩu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Quên mật khẩu</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {step === 1 && (
          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <button
              onClick={handleRequestOtp}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? "Đang gửi..." : "Gửi OTP"}
            </button>
          </div>
        )}
        {step === 2 && (
          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              disabled
            />
            <label className="block mb-2">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <label className="block mb-2">Mật khẩu mới</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <button
              onClick={handleResetPassword}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </button>
          </div>
        )}
        <button
          onClick={onClose}
          className="text-gray-500 hover:underline mt-4 block text-center"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
