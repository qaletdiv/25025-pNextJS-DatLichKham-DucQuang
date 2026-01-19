"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/app/redux/hook";
import { fetchAllAppointment } from "@/app/redux/slices/patient-appointment/patientAppointment.slices";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const orderId = searchParams.get("orderId");
  const [countdown, setCountdown] = useState(5);

  
  useEffect(() => {
    dispatch(fetchAllAppointment());
  }, []); 


  useEffect(() => {
    if (countdown <= 0) {
      router.push("/patient/appointment");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router]); 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-green-600"
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Thanh toán thành công!
          </h2>
          <p className="text-gray-600">
            Cảm ơn bạn đã thanh toán. Lịch khám của bạn đã được xác nhận.
          </p>
        </div>

        {orderId && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-500 mb-1">Mã đơn hàng</p>
            <p className="font-mono text-sm font-semibold text-gray-800 break-all">
              {orderId}
            </p>
          </div>
        )}

        <p className="text-sm text-gray-500 mb-4">
          Tự động chuyển về danh sách sau {countdown} giây...
        </p>

        <button
          onClick={() => router.push("/patient/appointment")}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Quay về danh sách ngay
        </button>
      </div>
    </div>
  );
}