import { CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../services/api";

const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading, success, failed

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const queryParams = new URLSearchParams(searchParams.toString());
        const { data } = await api.get(`/payment/vnpay-return?${queryParams.toString()}`);
        if (data && data.statusCode === 200) {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Payment verification failed", error);
        setStatus("failed");
      }
    };

    if (searchParams.get("vnp_SecureHash")) {
      verifyPayment();
    } else {
      setStatus("failed");
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-[32px] border border-gray-100 bg-white p-8 shadow-sm text-center">
        {status === "loading" && (
          <div className="animate-pulse space-y-4">
            <div className="mx-auto h-20 w-20 rounded-full bg-gray-200"></div>
            <h2 className="text-2xl font-bold text-gray-900">Đang xử lý thanh toán...</h2>
            <p className="text-gray-500">Vui lòng đợi trong giây lát</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6">
            <CheckCircle2 className="mx-auto h-24 w-24 text-green-500" />
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Thanh toán thành công!</h2>
            <p className="text-gray-600">
              Đơn đặt phòng của bạn đã được thanh toán và xác nhận. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
            </p>
            <div className="pt-4">
              <Link
                to="/profile"
                className="inline-flex w-full items-center justify-center rounded-full bg-rose-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-rose-600"
              >
                Xem lịch sử đặt phòng
              </Link>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="space-y-6">
            <XCircle className="mx-auto h-24 w-24 text-red-500" />
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Thanh toán thất bại</h2>
            <p className="text-gray-600">
              Giao dịch của bạn đã bị hủy hoặc xảy ra lỗi trong quá trình xử lý. Đơn đặt phòng vẫn được ghi nhận nhưng chưa thanh toán.
            </p>
            <div className="pt-4">
              <Link
                to="/profile"
                className="inline-flex w-full items-center justify-center rounded-full bg-rose-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-rose-600"
              >
                Quay lại hồ sơ
              </Link>
              <Link
                to="/"
                className="mt-4 inline-block text-sm font-medium text-rose-500 hover:text-rose-600"
              >
                Trở về trang chủ
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentResultPage;
