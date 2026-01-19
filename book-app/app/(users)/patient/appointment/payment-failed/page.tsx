"use client";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentFailed() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const message = searchParams.get("message");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Thanh toán thất bại
          </h2>
          <p className="text-gray-600">
            {message || "Có lỗi xảy ra trong quá trình thanh toán"}
          </p>
        </div>

        {orderId && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-500 mb-1">Mã đơn hàng</p>
            <p className="font-mono text-sm font-semibold text-gray-800">
              {orderId}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => router.push("/patient/appointment")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Thử lại thanh toán
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}