import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
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
        await login({
          email: form.email,
          password: form.password,
        });
        navigate("/");
      } else {
        await register(form);
        navigate("/");
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
    navigate("/forgot-password");
  };

  return (
    <div className="mx-auto grid max-w-4xl gap-4 lg:gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <section className="relative flex min-h-[300px] flex-col justify-center overflow-hidden rounded-3xl bg-gray-900 p-6 md:p-8">
        {/* Dark Image Background */}
        <img 
          src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1600&q=80" 
          alt="Auth background" 
          className="absolute inset-0 h-full w-full object-cover opacity-50 mix-blend-overlay"
        />
        <div className="relative z-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-rose-300">
            Tài khoản khách hàng
          </p>
          <h1 className="mt-2 text-xl font-extrabold tracking-tight text-white lg:text-2xl leading-[1.2]">
            {isLogin
              ? "Đăng nhập để tiếp tục đặt phòng"
              : "Tạo tài khoản để quản lý booking"}
          </h1>
          <p className="mt-2 text-[13px] font-medium text-gray-200 lg:text-sm">
             Trải nghiệm không gian lưu trú tuyệt vời và các dịch vụ tốt nhất.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm md:p-5 flex flex-col justify-center">
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

        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          {!isLogin ? (
            <>
              <label className="block">
                <span className="mb-1 block text-[13px] font-semibold text-gray-700">
                  Họ và tên
                </span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-[13px] outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-50"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[13px] font-semibold text-gray-700">
                  Số điện thoại
                </span>
                <input
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-[13px] outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-50"
                  required
                />
              </label>
            </>
          ) : null}

          <label className="block">
            <span className="mb-1 block text-[13px] font-semibold text-gray-700">
              Email
            </span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-[13px] outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-50"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[13px] font-semibold text-gray-700">
              Mật khẩu
            </span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-[13px] outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-50"
              required
            />
          </label>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-[13px] text-red-600">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-full bg-rose-500 px-4 py-2.5 text-[14px] font-bold text-white transition hover:-translate-y-1 hover:bg-rose-600 hover:shadow-md hover:shadow-rose-500/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 mt-2"
          >
            {submitting
              ? "Đang xử lý..."
              : isLogin
                ? "Đăng nhập"
                : "Tạo tài khoản"}
          </button>
        </form>

        <div className="mt-3 text-center">
          {isLogin && (
            <button
              type="button"
              className="text-[13px] font-medium text-blue-600 hover:text-blue-800 hover:underline"
              onClick={handleForgotPassword}
            >
              Quên mật khẩu?
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default AuthPage;
