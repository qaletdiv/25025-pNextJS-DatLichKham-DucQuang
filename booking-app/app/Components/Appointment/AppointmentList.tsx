"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAppointment } from "@/app/(Role)/patient/action"; 


interface Doctor {
  _id: string;
  first_name: string;
  last_name: string;
}

interface Schedule {
  _id: string;
  doctorId: Doctor;
  date: string;
  startTime: string;
  endTime: string;
}

interface MedicalForm {
  _id: string;
  description: string;
  pastMedicalHistory: string;
  status: string;
}

interface Appointment {
  _id: string;
  scheduleId: Schedule;
  medicalForm: MedicalForm;
  status: "pending" | "approved";
  meetingUrl: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        const result = await fetchAppointment();

        if (result?.error) {
          setError(result.error);
          return;
        }
        setAppointments(result.appointments || []);

      } catch (err) {
        console.error(err);
        setError("Có lỗi xảy ra khi tải danh sách lịch khám");
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  // Lọc dữ liệu
  const filteredAppointments = appointments.filter((appt) => {
    const doctorName = `${appt.scheduleId.doctorId.first_name} ${appt.scheduleId.doctorId.last_name}`.toLowerCase();
    const symptom = appt.medicalForm?.description?.toLowerCase() || "";

    const matchesSearch =
      doctorName.includes(searchTerm.toLowerCase()) ||
      symptom.includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || appt.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Badge trạng thái
  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      pending: { label: "Chờ xác nhận", className: "bg-yellow-100 text-yellow-800" },
      approved: { label: "Đã xác nhận", className: "bg-green-100 text-green-800" },
    };

    const c = config[status] || { label: status, className: "bg-gray-100 text-gray-800" };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.className}`}>
        {c.label}
      </span>
    );
  };

  // Format ngày giờ
  const formatDateTime = (dateStr: string, time: string) => {
    const date = new Date(dateStr);
    const datePart = date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return `${datePart} ${time}`;
  };

  // Format tiền
  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + " ₫";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải danh sách lịch khám...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-semibold mb-2">Lỗi</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md">
        {/* Header + Filter */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Danh sách lịch khám
          </h1>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Tìm theo bác sĩ hoặc triệu chứng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="approved">Đã xác nhận</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bác sĩ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian khám
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Triệu chứng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá khám
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Link Meet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy lịch khám nào
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appt) => (
                  <tr key={appt._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        BS. {appt.scheduleId.doctorId.first_name} {appt.scheduleId.doctorId.last_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDateTime(appt.scheduleId.date, appt.scheduleId.startTime)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {appt.scheduleId.startTime} – {appt.scheduleId.endTime}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {appt.medicalForm?.description || "Không có thông tin"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(appt.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(appt.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {appt.meetingUrl ? (
                        <a
                          href={appt.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Tham gia
                        </a>
                      ) : (
                        <span className="text-gray-400">Chưa có</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/patient/appointment/${appt._id}`}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                      >
                        Chi tiết
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer thống kê */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            Hiển thị {filteredAppointments.length} / {appointments.length} lịch khám
          </p>
        </div>
      </div>
    </div>
  );
}