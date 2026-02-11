// components/MedicalFormStaffDetail.tsx
"use client";

import { useEffect, useState } from "react";
import { getDetailMedicalForm, updateMedicalForm, getAllDepartments } from "@/app/(Role)/staff/action";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Patient {
  _id: string;
  username: string;
  email: string;
}

interface ImageData {
  url: string;
  public_id: string;
  _id: string;
}

interface Department {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface MedicalForm {
  _id: string;
  patient: Patient;
  images: ImageData[];
  description: string;
  pastMedicalHistory: string;
  status: "pending" | "approved" | "rejected";
  rejectedMessage: string | null;
  department?: Department;
  createdAt: string;
  updatedAt: string;
}

interface MedicalFormDetailProps {
  medicalId: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    pending: { label: "Chờ duyệt", className: "bg-yellow-100 text-yellow-800" },
    approved: { label: "Đã duyệt", className: "bg-green-100 text-green-800" },
    rejected: { label: "Từ chối", className: "bg-red-100 text-red-800" },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

export default function MedicalFormStaffDetail({ medicalId }: MedicalFormDetailProps) {
  const router = useRouter();
  const [medicalForm, setMedicalForm] = useState<MedicalForm | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  // State cho modal duyệt
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  // State cho modal từ chối
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectedMessage, setRejectedMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // Fetch medical form
      const formResult = await getDetailMedicalForm(medicalId);
      if (formResult.error) {
        setError(formResult.error);
      } else {
        setMedicalForm(formResult.medicalForm);
      }

      // Fetch departments
      const deptResult = await getAllDepartments();
      if (!deptResult.error) {
        setDepartments(deptResult.departments || []);
      }

      setLoading(false);
    };

    fetchData();
  }, [medicalId]);

  const handleApprove = async () => {
    if (!selectedDepartment) {
      alert("Vui lòng chọn khoa khám");
      return;
    }

    setProcessing(true);
    const result = await updateMedicalForm(
      medicalId,
      "approved",
      selectedDepartment
    );

    if (result.error) {
      alert(result.error);
    } else {
      alert("Duyệt phiếu khám thành công!");
      setShowApproveModal(false);
      // Refresh data
      const formResult = await getDetailMedicalForm(medicalId);
      if (!formResult.error) {
        setMedicalForm(formResult.medicalForm);
      }
    }
    setProcessing(false);
  };

  const handleReject = async () => {
    if (!rejectedMessage.trim()) {
      alert("Vui lòng nhập lý do từ chối");
      return;
    }

    setProcessing(true);
    const result = await updateMedicalForm(
      medicalId,
      "rejected",
      undefined,
      rejectedMessage
    );

    if (result.error) {
      alert(result.error);
    } else {
      alert("Từ chối phiếu khám thành công!");
      setShowRejectModal(false);
      // Refresh data
      const formResult = await getDetailMedicalForm(medicalId);
      if (!formResult.error) {
        setMedicalForm(formResult.medicalForm);
      }
    }
    setProcessing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800 text-center">{error}</p>
      </div>
    );
  }

  if (!medicalForm) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <p className="text-gray-800 text-center">Không tìm thấy phiếu khám</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header với Action Buttons */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Quay lại
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Chi tiết phiếu khám</h1>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={medicalForm.status} />
            {medicalForm.status === "pending" && (
              <>
                <button
                  onClick={() => setShowApproveModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  disabled={processing}
                >
                  Duyệt phiếu
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  disabled={processing}
                >
                  Từ chối
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Mã phiếu khám:</span>
            <p className="font-medium text-gray-900">{medicalForm._id}</p>
          </div>
          <div>
            <span className="text-gray-600">Ngày tạo:</span>
            <p className="font-medium text-gray-900">
              {new Date(medicalForm.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>
        </div>
      </div>

      {/* Thông tin bệnh nhân */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin bệnh nhân</h2>
        <div className="space-y-3">
          <div>
            <span className="text-gray-600 text-sm">Tên đăng nhập:</span>
            <p className="font-medium text-gray-900">{medicalForm.patient.username}</p>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Email:</span>
            <p className="font-medium text-gray-900">{medicalForm.patient.email}</p>
          </div>
        </div>
      </div>

      {/* Khoa điều trị */}
      {medicalForm.department && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Khoa điều trị</h2>
          <div className="space-y-3">
            <div>
              <span className="text-gray-600 text-sm">Tên khoa:</span>
              <p className="font-medium text-gray-900">{medicalForm.department.name}</p>
            </div>
            <div>
              <span className="text-gray-600 text-sm">Mô tả:</span>
              <p className="font-medium text-gray-900">{medicalForm.department.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mô tả triệu chứng */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Mô tả triệu chứng</h2>
        <p className="text-gray-700 whitespace-pre-wrap">
          {medicalForm.description || "Không có mô tả"}
        </p>
      </div>

      {/* Tiền sử bệnh */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tiền sử bệnh</h2>
        <p className="text-gray-700 whitespace-pre-wrap">
          {medicalForm.pastMedicalHistory || "Không có tiền sử bệnh"}
        </p>
      </div>

      {/* Hình ảnh */}
      {medicalForm.images && medicalForm.images.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Hình ảnh đính kèm ({medicalForm.images.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {medicalForm.images.map((image, index) => (
              <div key={image._id} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={image.url}
                  alt={`Hình ảnh ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-200"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lý do từ chối */}
      {medicalForm.status === "rejected" && medicalForm.rejectedMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 mb-4">Lý do từ chối</h2>
          <p className="text-red-700 whitespace-pre-wrap">{medicalForm.rejectedMessage}</p>
        </div>
      )}

      {/* Modal Duyệt */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Duyệt phiếu khám</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn khoa khám <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">-- Chọn khoa --</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={processing}
              >
                Hủy
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                disabled={processing}
              >
                {processing ? "Đang xử lý..." : "Xác nhận duyệt"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Từ chối */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Từ chối phiếu khám</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do từ chối <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectedMessage}
                onChange={(e) => setRejectedMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Nhập lý do từ chối..."
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={processing}
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                disabled={processing}
              >
                {processing ? "Đang xử lý..." : "Xác nhận từ chối"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}