"use client";

import { useState } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { type MedicalFormResponse } from "@/app/types/Api/MedicalFormType";
import { DataTable } from "@/app/Components/UI/DataTable";
import { Button } from "@/components/ui/button";

type Props = {
  forms: MedicalFormResponse[];
};

function getStatusColor(status: string) {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getStatusText(status: string) {
  switch (status) {
    case "approved":
      return "Đã duyệt";
    case "rejected":
      return "Từ chối";
    case "pending":
      return "Chờ duyệt";
    default:
      return status;
  }
}

export default function MedicalFormListComponent({ forms }: Props) {
  const [appointmentFilter, setAppointmentFilter] = useState<string>("all");

  const filteredForms = forms.filter((f) => {
    if (appointmentFilter === "booked") return f.hasAppointment === true;
    if (appointmentFilter === "unbooked") return f.hasAppointment === false;
    return true;
  });

  const columns: ColumnDef<MedicalFormResponse>[] = [
    {
      accessorKey: "_id",
      header: "Mã phiếu",
      cell: ({ row }) => {
        const id = row.getValue("_id") as string;
        return <span className="font-mono">#{id.slice(-6)}</span>;
      },
    },
    {
      accessorKey: "description",
      header: "Mô tả triệu chứng",
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return (
          <div className="max-w-[300px]">
            <p className="truncate" title={description}>
              {description}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "pastMedicalHistory",
      header: "Tiền sử bệnh",
      cell: ({ row }) => {
        const history = row.getValue("pastMedicalHistory") as string;
        return history ? (
          <div className="max-w-[200px]">
            <p className="truncate" title={history}>
              {history}
            </p>
          </div>
        ) : (
          <span className="text-gray-400">Không có</span>
        );
      },
    },
    {
      accessorKey: "department",
      header: "Khoa",
      cell: ({ row }) => {
        const department = row.original.department;
        return department ? (
          <span className="text-blue-600">{department.name}</span>
        ) : (
          <span className="text-gray-400">Chưa phân khoa</span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}
          >
            {getStatusText(status)}
          </span>
        );
      },
    },
    {
      accessorKey: "hasAppointment",
      header: "Đặt lịch",
      cell: ({ row }) => {
        const has = row.getValue("hasAppointment") as boolean;
        return has ? (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Đã đặt
          </span>
        ) : (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Chưa đặt
          </span>
        );
      },
    },
    {
      accessorKey: "images",
      header: "Hình ảnh",
      cell: ({ row }) => {
        const images = row.getValue("images") as unknown[];
        return (
          <div className="flex items-center gap-1">
            {images && images.length > 0 ? (
              <>
                <div className="flex -space-x-1">
                  {images.slice(0, 3).map((image) => (
                    <img
                      key={image._id}
                      src={image.url}
                      alt="Medical attachment"
                      className="w-8 h-8 rounded border-2 border-white object-cover"
                    />
                  ))}
                </div>
                {images.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{images.length - 3}
                  </span>
                )}
              </>
            ) : (
              <span className="text-gray-400 text-xs">Không có</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Ngày tạo",
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string;
        return (
          <span className="text-sm text-gray-600">
            {new Date(date).toLocaleDateString("vi-VN")}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        const id = row.getValue("_id") as string;
        return (
          <div className="flex items-center gap-2">
            <Link
              href={`/patient/medical-form/${id}`}
              className="outline px-2 py-2 rounded"
            >
              Xem chi tiết
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Danh sách phiếu khám</h1>
        <div className="flex gap-3 items-center">
          <select
            value={appointmentFilter}
            onChange={(e) => setAppointmentFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả phiếu</option>
            <option value="booked">Đã đặt lịch</option>
            <option value="unbooked">Chưa đặt lịch</option>
          </select>
          <Link href="/patient/medical-form/create-medical-form">
            <Button>Tạo phiếu mới</Button>
          </Link>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredForms}
        searchKey="description"
        searchPlaceholder="Tìm kiếm theo mô tả triệu chứng..."
      />
    </div>
  );
}
