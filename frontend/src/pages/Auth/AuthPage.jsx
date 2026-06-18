import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ForgotPasswordModal from "../../components/ForgotPasswordModal";

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/profile";
  const { login, register } = useAuth();
  const [mode, setMode] = useState(searchParams.get("mode") === "register" ? "register" : "login");

  useEffect(() => {
    const urlMode = searchParams.get("mode");
    if (urlMode === "register" || urlMode === "login") {
      setMode(urlMode);
    }
  }, [searchParams]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
  });
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const isLogin = useMemo(() => mode === "login", [mode]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (isLogin) {
        const response = await login({
          email: form.email,
          password: form.password,
        });
        if (response?.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        await register(form);
        navigate(redirectTo);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Không thể xử lý yêu cầu xác thực.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="relative flex min-h-[400px] flex-col justify-center overflow-hidden rounded-[36px] bg-gray-900 p-8 md:p-12">
        {/* Dark Image Background */}
        <img 
          src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1600&q=80" 
          alt="Auth background" 
          className="absolute inset-0 h-full w-full object-cover opacity-50 mix-blend-overlay"
        />
        <div className="relative z-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-rose-300">
            Tài khoản khách hàng
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-[54px] leading-[1.1]">
            {isLogin
              ? "Đăng nhập để tiếp tục đặt phòng"
              : "Tạo tài khoản để quản lý booking"}
          </h1>
          <p className="mt-6 text-lg font-medium text-gray-200 lg:text-xl">
             Trải nghiệm không gian lưu trú tuyệt vời và các dịch vụ tốt nhất.
          </p>
        </div>
      </section>

      <section className="rounded-[36px] border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        <div className="inline-flex rounded-full bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              isLogin ? "bg-white text-gray-950 shadow-sm" : "text-gray-500"
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              !isLogin ? "bg-white text-gray-950 shadow-sm" : "text-gray-500"
            }`}
          >
            Đăng ký
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isLogin ? (
            <>
              <label className="block">
                <span className="mb-2 block text-base font-semibold text-gray-700">
                  Họ và tên
                </span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-base outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-50"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-base font-semibold text-gray-700">
                  Số điện thoại
                </span>
                <input
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-base outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-50"
                  required
                />
              </label>
            </>
          ) : null}

          <label className="block">
            <span className="mb-2 block text-base font-semibold text-gray-700">
              Email
            </span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-base outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-50"
              required
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-base font-semibold text-gray-700">
              Mật khẩu
            </span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-base outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-50"
              required
            />
          </label>

          {error ? (
            <div className="rounded-[20px] border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-full bg-rose-500 px-6 py-4 text-lg font-bold text-white transition hover:-translate-y-1 hover:bg-rose-600 hover:shadow-xl hover:shadow-rose-500/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {submitting
              ? "Đang xử lý..."
              : isLogin
                ? "Đăng nhập"
                : "Tạo tài khoản"}
          </button>
        </form>

        <div className="mt-6 text-center">
          {isLogin && (
            <button
              type="button"
              className="text-base font-medium text-blue-600 hover:text-blue-800 hover:underline"
              onClick={handleForgotPassword}
            >
              Quên mật khẩu?
            </button>
          )}
        </div>
      </section>
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
};

export default AuthPage;
