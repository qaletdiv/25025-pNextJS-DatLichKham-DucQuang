"use client";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { useEffect } from "react";
import DataTable from "react-data-table-component";
import { fetchAllAppointment } from "@/app/redux/slices/patient-appointment/patientAppointment.slices";
import Link from "next/link";
import { payAppointment } from "../action";
export default function AppointmentList() {
  const { appointments, loading, error } = useAppSelector(
    (state) => state.patientAppointment
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAllAppointment());
  }, [dispatch]);

  const columns = [
    {
      name: "Mã phiếu khám",
      selector: (row: any) => row.medicalForm?._id,
      sortable: true,
      width: "260px",
    },
    {
      name: "Mô tả",
      selector: (row: any) => row.medicalForm?.description || "—",
      wrap: true,
    },
    {
      name: "Ngày khám",
      selector: (row: any) =>
        row.scheduleId
          ? new Date(row.scheduleId.date).toLocaleDateString("vi-VN")
          : "Chưa có",
    },
    {
      name: "Thời gian khám",
      selector: (row: any) => {
        if (!row.scheduleId) return "Chưa có";
        const start = row.scheduleId.startTime;
        const end = row.scheduleId.endTime;

        return `${start} - ${end}`;
      },
      sortable: true,
      wrap: true,
    },
    {
      name: "Bác sĩ",
      selector: (row: any) => {
        if (!row.scheduleId.doctorId) return "Chưa có";
        const first_name = row.scheduleId.doctorId.first_name;
        const last_name = row.scheduleId.doctorId.last_name;

        return `${first_name} ${last_name}`;
      },
      sortable: true,
    },
    {
      name: "Viện phí",
      selector: (row: any) => row.price?.toLocaleString("vi-VN") + " ₫",
      sortable: true,
    },
    {
      name: "Phòng Khám",
      selector: (row: any) => row.meetingUrl || "Chưa có",
      wrap: true,
    },
    {
      name: "Trạng thái",
      selector: (row: any) => row.status,
      cell: (row: any) => (
        <span
          className={`px-2 py-1 rounded text-white text-sm ${
            row.status === "pending"
              ? "bg-yellow-500"
              : row.status === "done"
              ? "bg-green-600"
              : "bg-gray-400"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Hành động",
      cell: (row: any) => (
        <div className="flex gap-2">
          <Link
            href={`/patient/appointment/${row._id}`}
            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Xem
          </Link>

          <form action={payAppointment} className="inline">
            <input type="hidden" name="id" value={row._id} />
            <button
              type="submit"
              disabled={row.status !== "pending"} // tùy chọn: chỉ cho phép nếu đang pending
              className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Thanh toán
            </button>
          </form>
        </div>
      ),
      width: "200px",
    },
  ];

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Danh sách lịch khám bệnh</h1>
      </div>
      <DataTable
        key={appointments?.length}
        columns={columns}
        data={appointments || []}
        pagination
        highlightOnHover
        responsive
        noDataComponent={<p className="py-4">Chưa có phiếu khám nào</p>}
      />
    </div>
  );
}
