import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { requestPasswordReset, resetPassword } from "../../services/authService";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: enter email, 2: enter otp & new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await requestPasswordReset(email);
      setMessage("Mã xác thực (OTP) đã được gửi đến email của bạn.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể gửi email. Vui lòng kiểm tra lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await resetPassword(email, otp, newPassword);
      alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
      navigate("/auth");
    } catch (err) {
      setError(err.response?.data?.message || "Mã OTP không hợp lệ hoặc đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-white px-4">
      <div className="w-full max-w-md rounded-[32px] border border-gray-100 p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-950">
            Quên mật khẩu
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {step === 1 ? "Nhập email của bạn để nhận mã khôi phục" : "Nhập mã OTP và mật khẩu mới"}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-[20px] bg-red-50 p-4 text-sm text-red-600 border border-red-100">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-6 rounded-[20px] bg-green-50 p-4 text-sm text-green-600 border border-green-100">
            {message}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-950">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-[20px] border border-gray-200 bg-gray-50 px-5 py-4 text-sm outline-none transition focus:border-rose-500 focus:bg-white"
                placeholder="Nhập email của bạn"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-rose-500 py-4 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-50"
            >
              {loading ? "Đang gửi..." : "Nhận mã OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-950">
                Mã OTP
              </label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full rounded-[20px] border border-gray-200 bg-gray-50 px-5 py-4 text-sm outline-none transition focus:border-rose-500 focus:bg-white tracking-widest text-center text-lg font-mono"
                placeholder="Ví dụ: 123456"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-950">
                Mật khẩu mới
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-[20px] border border-gray-200 bg-gray-50 px-5 py-4 text-sm outline-none transition focus:border-rose-500 focus:bg-white"
                placeholder="Nhập mật khẩu mới"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-rose-500 py-4 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/auth"
            className="text-sm font-medium text-rose-500 transition hover:text-rose-600"
          >
            Quay lại Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
