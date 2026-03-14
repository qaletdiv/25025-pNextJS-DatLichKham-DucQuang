import {
  User,
  FileText,
  Building2,
  Clock,
  CheckCircle,
  CalendarPlus,
} from "lucide-react";
import Link from "next/link";
interface Patient {
  _id: string;
  username: string;
  email: string;
}

interface Image {
  url: string;
  public_id: string;
  _id: string;
}

interface Department {
  _id: string;
  name: string;
  description: string;
}

interface MedicalFormData {
  _id: string;
  patient: Patient;
  images: Image[];
  description: string;
  pastMedicalHistory: string;
  status: string;
  rejectedMessage: string | null;
  department: Department;
  createdAt: string;
  updatedAt: string;
}

type MedicalFormProp = {
  id: string;
  data: MedicalFormData;
  hasAppointment: boolean;
};

const statusColor: Record<string, string> = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
};

const statusLabel: Record<string, string> = {
  approved: "Đã duyệt",
  pending: "Chờ duyệt",
  rejected: "Từ chối",
  cancelled: "Đã hủy",
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const renderRow = (
  icon: React.ReactNode,
  label: string,
  value?: React.ReactNode,
) => (
  <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-center">
    <span className="flex items-center gap-2 font-medium text-gray-500 sm:w-52 text-sm">
      {icon} {label}
    </span>
    <span className="text-gray-900 text-sm">{value || "-"}</span>
  </div>
);

export default function MedicalFormDetail({
  id,
  data,
  hasAppointment,
}: MedicalFormProp) {
  if (!data) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Chi tiết phiếu khám</h1>
          <p className="text-gray-400 text-xs mt-1 font-mono">
            #{id.slice(-8).toUpperCase()}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor[data.status] ?? statusColor["pending"]}`}
        >
          {statusLabel[data.status] ?? data.status}
        </span>
        {hasAppointment ? (
          <button
            disabled
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-400 cursor-not-allowed"
          >
            <CalendarPlus size={16} /> Đã đăng ký
          </button>
        ) : (
          <Link
            href={`/patient/appointment/create/${id}`} // ← đổi lại đúng route của bạn
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <CalendarPlus size={16} /> Đăng ký lịch khám
          </Link>
        )}
      </div>

      {/* Thông tin bệnh nhân */}
      <div className="bg-white rounded-2xl shadow p-5 space-y-4">
        <h2 className="text-lg font-semibold">Thông tin bệnh nhân</h2>
        {renderRow(<User size={15} />, "Tên đăng nhập", data.patient.username)}
        {renderRow(<FileText size={15} />, "Email", data.patient.email)}
      </div>

      {/* Thông tin phiếu khám */}
      <div className="bg-white rounded-2xl shadow p-5 space-y-4">
        <h2 className="text-lg font-semibold">Thông tin phiếu khám</h2>
        {renderRow(<Building2 size={15} />, "Khoa khám", data.department?.name)}
        {renderRow(
          <FileText size={15} />,
          "Mô tả triệu chứng",
          data.description,
        )}
        {renderRow(
          <FileText size={15} />,
          "Tiền sử bệnh",
          data.pastMedicalHistory,
        )}
        {data.rejectedMessage &&
          renderRow(
            <FileText size={15} />,
            "Lý do từ chối",
            <span className="text-red-500">{data.rejectedMessage}</span>,
          )}
        {renderRow(
          <CheckCircle size={15} />,
          "Đã có lịch hẹn",
          hasAppointment ? "Có" : "Chưa",
        )}
      </div>

      {/* Hình ảnh */}
      {data.images.length > 0 && (
        <div className="bg-white rounded-2xl shadow p-5 space-y-4">
          <h2 className="text-lg font-semibold">Hình ảnh đính kèm</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {data.images.map((img) => (
              <a key={img._id} href={img.url} target="_blank" rel="noreferrer">
                <img
                  src={img.url}
                  alt="Ảnh phiếu khám"
                  className="rounded-xl object-cover w-full h-40 hover:opacity-80 transition"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <p className="text-right text-xs text-gray-400">
        Tạo lúc: {formatDate(data.createdAt)}
      </p>
    </div>
  );
}
