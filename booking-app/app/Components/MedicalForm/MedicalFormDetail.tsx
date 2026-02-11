import { type ParamType } from "@/app/types/Common/ParamType";
import { fetchDetailMedicalForm } from "@/app/(Role)/patient/action";
import Image from "next/image";
import Link from "next/link";
import BackButton from "../UI/BackButton";

export default async function MedicalFormDetail({ id }: ParamType) {
  const res = await fetchDetailMedicalForm(id);
  const medicalForm = res?.medicalForm;

  if (!medicalForm) {
    return <div className="p-6 text-red-500">Không tìm thấy phiếu khám</div>;
  }

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  const formatDate = (date: string) => new Date(date).toLocaleString("vi-VN");

  const renderRow = (label: string, value?: string | null) => (
    <div className="flex flex-col sm:flex-row sm:gap-4">
      <span className="font-medium text-gray-600 sm:w-48">{label}</span>
      <span className="text-gray-900">{value || "-"}</span>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Chi tiết phiếu khám</h1>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor[medicalForm.status]}`}
        >
          {medicalForm.status.toUpperCase()}
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow p-5 space-y-4">
        <h2 className="text-lg font-semibold">Thông tin bệnh nhân</h2>
        {renderRow("Tên bệnh nhân", medicalForm.patient.username)}
        {renderRow("Email", medicalForm.patient.email)}
      </div>

      <div className="bg-white rounded-2xl shadow p-5 space-y-4">
        <h2 className="text-lg font-semibold">Nội dung khám</h2>
        {renderRow("Mô tả triệu chứng", medicalForm.description)}
        {renderRow("Tiền sử bệnh", medicalForm.pastMedicalHistory)}
      </div>

      <div className="bg-white rounded-2xl shadow p-5 space-y-4">
        <h2 className="text-lg font-semibold">Hình ảnh đính kèm</h2>

        {medicalForm.images.length === 0 ? (
          <p className="text-gray-500">Không có hình ảnh</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {medicalForm.images.map((img: any) => (
              <div
                key={img._id}
                className="relative aspect-square rounded-xl overflow-hidden border"
              >
                <Image
                  src={img.url}
                  alt="Medical image"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow p-5 space-y-4">
        <h2 className="text-lg font-semibold">Thời gian</h2>
        {renderRow("Ngày tạo", formatDate(medicalForm.createdAt))}
        {renderRow("Cập nhật", formatDate(medicalForm.updatedAt))}
      </div>

      {medicalForm.status === "rejected" && medicalForm.rejectedMessage && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <h2 className="text-lg font-semibold text-red-700">Lý do từ chối</h2>
          <p className="text-red-600 mt-2">{medicalForm.rejectedMessage}</p>
        </div>
      )}
      <div className="flex justify-between items-center">
        <BackButton />

        {medicalForm.status === "approved" ? (
          <Link
            href={`/patient/appointment/create/${medicalForm._id}`}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            Đăng ký lịch khám
          </Link>
        ) : (
          <button
            disabled
            className="px-4 py-2 rounded-lg bg-gray-300 text-gray-500 cursor-not-allowed"
          >
            Đăng ký lịch khám
          </button>
        )}
      </div>
    </div>
  );
}
