"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  useEffect(() => {
    // Chỉ countdown
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // useEffect riêng cho redirect
  useEffect(() => {
    if (countdown <= 0) {
      router.push("/patient/appointments");
    }
  }, [countdown, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        {/* Icon thành công */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Tiêu đề */}
        <h2 className="text-2xl font-bold text-green-600 text-center mb-4">
          Thanh toán thành công!
        </h2>

        {/* Thông tin */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-green-800 text-center">
            Đặt lịch khám của bạn đã được xác nhận
          </p>
        </div>

        {/* Chi tiết */}
        <div className="space-y-3 mb-6">
          {orderId && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Mã đơn hàng:</p>
              <p className="text-sm font-mono text-gray-700 break-all">
                {orderId}
              </p>
            </div>
          )}

          {amount && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Số tiền:</p>
              <p className="text-lg font-bold text-gray-700">
                {Number(amount).toLocaleString("vi-VN")} VNĐ
              </p>
            </div>
          )}
        </div>

        {/* Countdown */}
        {countdown > 0 && (
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500">
              Chuyển đến trang lịch hẹn trong{" "}
              <span className="font-bold text-green-600">{countdown}</span> giây
            </p>
          </div>
        )}

        {/* Nút hành động */}
        <button
          onClick={() => router.push("/patient/appointments")}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
        >
          Xem lịch hẹn ngay
        </button>
      </div>
    </div>
  );
}