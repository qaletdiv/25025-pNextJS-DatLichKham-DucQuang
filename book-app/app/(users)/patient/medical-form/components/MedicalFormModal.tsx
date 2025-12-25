"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    medicalFormSchema,
    MedicalFormInputs,
} from "@/lib/YupSchema/medicalFormSchema/medicalFormSchema";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { createMedicalForm } from "@/app/redux/slices/staff-medical/medical.slices";

interface MedicalFormModalProps {
    open: boolean;
    onClose: () => void;
}

export default function MedicalFormModal({ open, onClose }: MedicalFormModalProps) {
    const [preview, setPreview] = useState<string[]>([]);
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state: any) => state.medical);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
        reset,
    } = useForm<MedicalFormInputs>({
        resolver: yupResolver(medicalFormSchema) as any,
        defaultValues: {
            description: "",
            pastMedicalHistory: "",
            images: [],
        },
    });

    const images = watch("images");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles) return;

        const fileArray = Array.from(selectedFiles);
        setValue("images", fileArray, { shouldValidate: true });

        const urls = fileArray.map((file) => URL.createObjectURL(file));
        setPreview(urls);
    };


    const onSubmit = async (data: MedicalFormInputs) => {
        try {
            await dispatch(
                createMedicalForm({
                    description: data.description,
                    pastMedicalHistory: data.pastMedicalHistory || "",
                    images: (data.images || []).filter((img): img is File => img !== undefined),
                }) as any
            ).unwrap();

            reset();
            setPreview([]);
            onClose();
            alert("Tạo phiếu khám thành công!");
        } catch (err: any) {
            console.error("Lỗi:", err);
            alert(err || "Có lỗi xảy ra!");
        }
    };

    const handleClose = () => {
        reset();
        setPreview([]);
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-4xl p-6 rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Tạo phiếu khám</h2>

                <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
                    {/* Mô tả */}
                    <div>
                        <label className="font-medium">
                            Mô tả <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            {...register("description")}
                            className={`w-full mt-1 border rounded px-3 py-2 ${errors.description ? "border-red-500" : "border-gray-300"
                                }`}
                            rows={3}
                            placeholder="Nhập mô tả triệu chứng..."
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Tiền sử bệnh */}
                    <div>
                        <label className="font-medium">
                            Tiền sử bệnh
                            <span className="text-gray-400 text-sm ml-2">(Không bắt buộc)</span>
                        </label>
                        <textarea
                            {...register("pastMedicalHistory")}
                            className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
                            rows={3}
                            placeholder="Nhập tiền sử bệnh nếu có..."
                        />
                    </div>

                    {/* Ảnh */}
                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-gray-700">
                            Ảnh các triệu chứng
                            <span className="text-gray-400 text-sm ml-2">(Không bắt buộc)</span>
                        </label>

                        <label
                            htmlFor="symptomImages"
                            className="border border-gray-200 rounded-xl p-4 text-center cursor-pointer bg-white shadow-sm hover:shadow transition text-gray-600"
                        >
                            Chọn ảnh (nhiều ảnh)
                        </label>

                        <input
                            id="symptomImages"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        {images && images.length > 0 && (
                            <p className="text-sm text-gray-500">
                                Đã chọn <strong>{images.length}</strong> ảnh
                            </p>
                        )}

                        {preview.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                {preview.map((url, i) => (
                                    <div key={i} className="relative group">
                                        <Image
                                            src={url}
                                            alt={`preview-${i}`}
                                            width={200}
                                            height={96}
                                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newImages = Array.from(images || []).filter((_, idx) => idx !== i);
                                                setValue("images", newImages, { shouldValidate: true });
                                                setPreview(preview.filter((_, idx) => idx !== i));
                                            }}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded">
                            {error}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                            disabled={isSubmitting || loading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400"
                            disabled={isSubmitting || loading}
                        >
                            {isSubmitting || loading ? "Đang lưu..." : "Lưu phiếu"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
