"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  appointmentId: string;
}

const ConfirmPayment = ({ appointmentId }: Props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    if (!confirm("Bạn có chắc muốn xác nhận lịch hẹn này không?")) return;
   
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/staffs/appointments/${appointmentId}/confirm`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Xác nhận thất bại");

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleConfirm}
      disabled={loading}
      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs disabled:opacity-50 transition-colors"
    >
      {loading ? "Đang xử lý..." : "Xác nhận"}
    </button>
  );
};

export default ConfirmPayment;
