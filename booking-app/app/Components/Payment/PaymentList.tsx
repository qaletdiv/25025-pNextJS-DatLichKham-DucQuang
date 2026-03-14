import React from "react";
import { cookies } from "next/headers";
import Link from "next/link";
import ConfirmPayment from "@/app/Components/Payment/ConfirmedPayment"

async function getPayment(page = 1) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return { error: "Bạn cần đăng nhập để thực hiện chức năng này" };
  }
  const response = await fetch(
    `http://localhost:5000/api/v1/staffs/payments-stripe?page=${page}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-store",
      },
    },
  );
  if (!response.ok) return { payments: [], pagination: null };
  return response.json();
}

interface Props {
  page?: number;
}

const PaymentList = async ({ page = 1 }: Props) => {
  const { payments, pagination } = await getPayment(page);
  return (
    <div>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Mã giao dịch</th>
            <th className="p-3 text-left">Mã lịch hẹn</th>
            <th className="p-3 text-left">Ngày giờ khám</th>
            <th className="p-3 text-left">Số tiền</th>
            <th className="p-3 text-left">Ngày tạo</th>
            <th className="p-3 text-left">Trạng thái</th>
            <th className="p-3 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {payments?.map((payment: any) => {
            const appointment = payment.appointmentId;
            const schedule = appointment?.scheduleId;

            return (
              <tr key={payment._id} className="border-b hover:bg-gray-50">
                {/* Mã giao dịch */}
                <td className="p-3 text-xs text-gray-500 max-w-[150px] truncate">
                  {payment.stripePaymentId ?? "—"}
                </td>

                {/* Mã lịch hẹn */}
                <td className="p-3 text-xs text-gray-500">
                  {appointment?._id ?? "—"}
                </td>

                {/* Ngày giờ khám */}
                <td className="p-3">
                  {schedule ? (
                    <div>
                      <div className="font-medium">
                        {new Date(schedule.date).toLocaleDateString("vi-VN")}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {schedule.startTime} - {schedule.endTime}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>

                {/* Số tiền */}
                <td className="p-3 font-medium">
                  {(payment.amount / 100).toLocaleString("vi-VN")}đ
                </td>

                {/* Ngày tạo */}
                <td className="p-3 text-gray-500">
                  {new Date(payment.createdAt).toLocaleDateString("vi-VN")}
                </td>

                {/* Trạng thái */}
                {/* Trạng thái thanh toán */}
                <td className="p-3">
                  {payment.status === "paid" && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                      Đã thanh toán
                    </span>
                  )}
                  {payment.status === "failed" && (
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                      Thất bại
                    </span>
                  )}
                  {payment.status === "pending" && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      Chờ thanh toán
                    </span>
                  )}
                </td>

                {/* Trạng thái lịch hẹn */}
                <td className="p-3">
                  {appointment?.status === "pending" && (
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                      Chờ xác nhận
                    </span>
                  )}
                  {appointment?.status === "approved" && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                      Đã xác nhận
                    </span>
                  )}
                  {!appointment && (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </td>

                {/* Hành động */}
                <td className="p-3">
                  {payment.status === "paid" && appointment?.status === "pending" && (
                    <ConfirmPayment appointmentId={appointment._id} />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {pagination && (
        <div className="flex items-center gap-4 mt-4 justify-end">
          <Link
            href={`?tab=payment&page=${page - 1}`}
            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
          >
            ← Trước
          </Link>
          <span>
            Trang {pagination.page} / {pagination.totalPages}
          </span>
          <Link
            href={`?tab=payment&page=${page + 1}`}
            className={
              page >= pagination.totalPages
                ? "pointer-events-none opacity-50"
                : ""
            }
          >
            Sau →
          </Link>
        </div>
      )}
    </div>
  );
};

export default PaymentList;
