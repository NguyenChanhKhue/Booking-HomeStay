import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/profile";
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
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
      } else {
        await register(form);
      }
      navigate(redirectTo);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể xử lý yêu cầu xác thực.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[36px] bg-[linear-gradient(135deg,#fff1f2_0%,#ffffff_50%,#fef3f2_100%)] p-8 md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-500">
          Tài khoản khách hàng
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-gray-950 md:text-5xl">
          {isLogin ? "Đăng nhập để tiếp tục đặt phòng" : "Tạo tài khoản để quản lý booking"}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-8 text-gray-600">
          Giao diện xác thực này đang dùng trực tiếp các endpoint đăng nhập và đăng ký từ backend.
        </p>
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

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {!isLogin ? (
            <>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">Họ và tên</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-300"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Số điện thoại
                </span>
                <input
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-300"
                  required
                />
              </label>
            </>
          ) : null}

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-300"
              required
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">Mật khẩu</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-300"
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
            className="inline-flex w-full items-center justify-center rounded-full bg-rose-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Đang xử lý..."
              : isLogin
              ? "Đăng nhập"
              : "Tạo tài khoản"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default AuthPage;
