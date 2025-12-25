"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  getDetailMedicalForm,
  updateMedicalForm,
} from "@/app/redux/slices/staff-medical/medical.slices";
import { getAllDepartment } from "@/app/redux/slices/department/department.slices";

export default function Detail({ id }: { id: string }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { medicalForm, loading, error } = useSelector(
    (state: any) => state.medical
  );
  const { departments } = useSelector((state: any) => state.department);

  const [status, setStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const [rejectReason, setRejectReason] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(getDetailMedicalForm(id) as any);
      dispatch(getAllDepartment() as any);
    }
  }, [id, dispatch]);

  const handleSubmit = async () => {
    try {
      if (status === "rejected") {
        await dispatch(
          updateMedicalForm({
            id,
            status: "rejected",
            rejectedMessage: rejectReason,
          }) as any
        ).unwrap();
      } else if (status === "approved") {
        await dispatch(
          updateMedicalForm({
            id,
            status: "approved",
            department: selectedDepartment,
          }) as any
        ).unwrap();
      }
      router.push("/staff/medical-list");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const getStatusStyle = (s: string) => {
    switch (s) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) return <div className="flex justify-center p-8">Đang tải...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!medicalForm) return <div className="p-4">Không tìm thấy phiếu khám.</div>;


  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Chi tiết phiếu khám</h1>
          <p className="text-blue-100 text-sm">Mã phiếu: {medicalForm._id}</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Patient Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm">Tên bệnh nhân</p>
              <p className="font-semibold text-lg">{medicalForm.patient?.username}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm">Email</p>
              <p className="font-semibold">{medicalForm.patient?.email}</p>
            </div>
          </div>

          {/* Medical Info */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">Mô tả bệnh</p>
              <p>{medicalForm.description || "Chưa có"}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">Tiền sử bệnh</p>
              <p>{medicalForm.pastMedicalHistory || "Chưa có"}</p>
            </div>
          </div>

          {/* Status & Department */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">Trạng thái</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(medicalForm.status)}`}>
                {medicalForm.status === "approved" ? "Đã duyệt" :
                  medicalForm.status === "rejected" ? "Từ chối" : "Chờ duyệt"}
              </span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">Chuyên khoa</p>
              <p className="font-medium">{medicalForm.department?.name || "Chưa phân"}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">Ngày tạo</p>
              <p>{new Date(medicalForm.createdAt).toLocaleString("vi-VN")}</p>
            </div>
          </div>

          {/* Images */}
          {medicalForm.images && medicalForm.images.length > 0 && (
            <div>
              <p className="text-gray-500 text-sm mb-3">Hình ảnh đính kèm ({medicalForm.images.length})</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {medicalForm.images.map((img: any, index: number) => (
                  <div
                    key={img._id || index}
                    className="relative aspect-square rounded-lg overflow-hidden border cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => window.open(img.url, "_blank")}
                  >
                    <Image
                      src={img.url}
                      alt={`Ảnh ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {(medicalForm.status === "pending" || medicalForm.status === "approved" || medicalForm.status === "rejected") && (
            <>
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => setStatus("approved")}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors ${status === "approved"
                    ? "bg-green-600 text-white"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                >
                  Duyệt Phiếu
                </button>
                <button
                  onClick={() => setStatus("rejected")}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors ${status === "rejected"
                    ? "bg-red-600 text-white"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                >
                  Từ chối
                </button>
              </div>

              {/* Reject Form */}
              {status === "rejected" && (
                <div className="bg-red-50 p-4 rounded-lg space-y-3">
                  <label className="block font-medium text-red-700">Lý do từ chối:</label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full border border-red-200 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                    rows={3}
                    placeholder="Nhập lý do từ chối..."
                  />
                  <button
                    onClick={handleSubmit}
                    className="w-full py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                  >
                    Xác nhận từ chối
                  </button>
                </div>
              )}

              {/* Approve Form */}
              {status === "approved" && (
                <div className="bg-green-50 p-4 rounded-lg space-y-3">
                  <label className="block font-medium text-green-700">Chọn chuyên khoa:</label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full border border-green-200 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  >
                    <option value="">-- Chọn chuyên khoa --</option>
                    {departments?.map((dept: any) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleSubmit}
                    className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                  >
                    Xác nhận duyệt
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
