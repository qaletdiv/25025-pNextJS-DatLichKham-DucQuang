"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentFailed() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  const orderId = searchParams.get("orderId");
  const message = searchParams.get("message");

  useEffect(() => {
    // Chỉ countdown, không redirect trong đây
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // useEffect riêng cho redirect
  useEffect(() => {
    if (countdown <= 0) {
      router.push("/patient/appointment");
    }
  }, [countdown, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        {/* Icon thất bại */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-600"
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
        </div>

        {/* Tiêu đề */}
        <h2 className="text-2xl font-bold text-red-600 text-center mb-4">
          Thanh toán thất bại
        </h2>

        {/* Thông báo lỗi */}
        {message && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-800 text-center">
              {decodeURIComponent(message)}
            </p>
          </div>
        )}

        {/* Mã đơn hàng */}
        {orderId && (
          <div className="bg-gray-50 rounded-lg p-3 mb-6">
            <p className="text-xs text-gray-500 mb-1">Mã đơn hàng:</p>
            <p className="text-sm font-mono text-gray-700 break-all">
              {orderId}
            </p>
          </div>
        )}

        {/* Hướng dẫn */}
        <div className="text-center mb-6">
          <p className="text-gray-600 mb-2">
            Giao dịch của bạn chưa được hoàn tất.
          </p>
          <p className="text-sm text-gray-500">
            Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp diễn.
          </p>
        </div>

        {/* Countdown */}
        {countdown > 0 && (
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500">
              Tự động quay lại trong{" "}
              <span className="font-bold text-red-600">{countdown}</span> giây
            </p>
          </div>
        )}

        {/* Nút hành động */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/patient/appointment")}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            Quay lại
          </button>
          <button
            onClick={() => router.push("/patient/appointment")}
            className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition"
          >
            Đặt lại
          </button>
        </div>
      </div>
    </div>
  );
}