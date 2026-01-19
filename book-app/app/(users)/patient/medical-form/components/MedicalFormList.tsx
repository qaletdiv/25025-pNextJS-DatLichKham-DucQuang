"use client";

import { useEffect } from "react";
import DataTable from "react-data-table-component";
import { useAppSelector, useAppDispatch } from "@/app/redux/hook";
import { getAllMedicals } from "@/app/redux/slices/patient-medical/patients.slices";
import Link from "next/link";

interface MedicalFormListProps {
  onOpenModal: () => void;
}

export default function MedicalFormList({ onOpenModal }: MedicalFormListProps) {
  const dispatch = useAppDispatch();
  const { medicalList, loading } = useAppSelector(
    (state: any) => state.patientMedical
  );

  useEffect(() => {
    dispatch(getAllMedicals() as any);
  }, [dispatch]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Đã duyệt";
      case "rejected":
        return "Từ chối";
      default:
        return "Chờ duyệt";
    }
  };

  const columns = [
    {
      name: "Mô tả",
      selector: (row: any) => row.description,
      sortable: true,
      width: "250px",
    },
    {
      name: "Chuyên khoa",
      selector: (row: any) => row.department?.name || "Chưa phân",
      sortable: true,
      width: "150px",
    },
    {
      name: "Trạng thái",
      cell: (row: any) => (
        <span
          className={`px-2 py-1 rounded text-sm ${getStatusStyle(row.status)}`}
        >
          {getStatusText(row.status)}
        </span>
      ),
      width: "120px",
    },
    {
      name: "Lý do từ chối",
      selector: (row: any) => row.rejectedMessage || "Không có",
      width: "120px",
    },
    {
      name: "Ngày tạo",
      selector: (row: any) =>
        new Date(row.createdAt).toLocaleDateString("vi-VN"),
      sortable: true,
      width: "120px",
    },
    {
      name: "Hành động",
      cell: (row: any) => (
        <div className="flex gap-2">
          <Link
            href={`/patient/medical-form/${row._id}`}
            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Xem
          </Link>

          <Link
            href={`/patient/appointment/create-appointment/${row._id}`}
            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Tạo lịch khám
          </Link>
        </div>
      ),
      width: "200px",
    },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Danh sách phiếu khám bệnh</h1>
        <button
          onClick={onOpenModal}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
        >
          Tạo phiếu khám
        </button>
      </div>

      <DataTable
        columns={columns}
        data={medicalList || []}
        pagination
        highlightOnHover
        responsive
        progressPending={loading}
        noDataComponent={<p className="py-4">Chưa có phiếu khám nào</p>}
      />
    </div>
  );
}
