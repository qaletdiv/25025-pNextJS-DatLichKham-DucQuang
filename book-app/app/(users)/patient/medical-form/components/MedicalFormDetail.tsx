"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { useEffect } from "react";
import Image from "next/image";
import { getDetailMedical } from "@/app/redux/slices/patient-medical/patients.slices";

export default function MedicalFormDetail({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const { medicalDetail } = useAppSelector((state) => state.patientMedical);

  useEffect(() => {
    dispatch(getDetailMedical(id));
  }, [dispatch, id]);

  console.log("Medical Detail:", medicalDetail);
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-6">Medical Form Detail</h2>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Text info */}
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-500">Họ và tên</p>
            <p className="col-span-2 font-medium">
              {medicalDetail?.medicalForm.patient.username || "—"}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-500">Email</p>
            <p className="col-span-2 font-medium">
              {medicalDetail?.medicalForm.patient.email || "—"}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-500">Mô tả</p>
            <p className="col-span-2 font-medium">
              {medicalDetail?.medicalForm.description || "—"}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-500">Tiền sử bệnh</p>
            <p className="col-span-2 font-medium">
              {medicalDetail?.medicalForm.pastMedicalHistory || "—"}
            </p>
          </div>
        </div>

        {/* Images */}
        <div>
          <p className="text-gray-500 mb-3">Hình ảnh đính kèm</p>

          <div className="grid grid-cols-3 gap-3">
            {medicalDetail?.medicalForm?.images?.length ? (
              medicalDetail.medicalForm.images.map((img: any) => (
                <div
                  key={img._id}
                  className="aspect-square border rounded-md overflow-hidden"
                >
                  <Image
                    src={img.url}
                    alt="medical-image"
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <p className="col-span-3 text-sm text-gray-400">
                Không có hình ảnh
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
