"use client"

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Input from "@/app/Components/UI/Input"
import { creatFormSchema } from '@/app/YubValidation/FormSchema/FormSchema'
import { createMedicalForm } from '@/app/(Role)/patient/action'
import BackButton from '../UI/BackButton'
import { FileText, Image as ImageIcon, AlertCircle, CheckCircle2, X } from 'lucide-react'

type FormData = {
    description: string
    pastMedicalHistory?: string
    image?: FileList
}

export default function CreateMedicalFormComponent() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [previewImages, setPreviewImages] = useState<string[]>([])

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm<FormData>({
        resolver: yupResolver(creatFormSchema)
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            const filesArray = Array.from(files)
            setSelectedFiles(prev => [...prev, ...filesArray])
            
            const imageUrls = filesArray.map(file => URL.createObjectURL(file))
            setPreviewImages(prev => [...prev, ...imageUrls])
        }
    }

    const removeImage = (index: number) => {
       
        URL.revokeObjectURL(previewImages[index])
        
        
        setPreviewImages(prev => prev.filter((_, i) => i !== index))
        
       
        const newFiles = selectedFiles.filter((_, i) => i !== index)
        setSelectedFiles(newFiles)
        
        // Update react-hook-form value
        const dataTransfer = new DataTransfer()
        newFiles.forEach(file => dataTransfer.items.add(file))
        setValue('image', dataTransfer.files)
    }

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true)
        setSubmitMessage(null)

        try {
            const formData = new FormData()
            formData.append('description', data.description)

            if (data.pastMedicalHistory) {
                formData.append('pastMedicalHistory', data.pastMedicalHistory)
            }

            // Dùng selectedFiles thay vì data.image
            if (selectedFiles.length > 0) {
                selectedFiles.forEach((file) => {
                    formData.append('images', file)
                })
            }

            const result = await createMedicalForm(formData)

            if ('error' in result) {
                setSubmitMessage({ type: 'error', message: result.error })
            } else {
                setSubmitMessage({ type: 'success', message: 'Tạo phiếu khám thành công!' })
                reset()
                setPreviewImages([])
                setSelectedFiles([])
                setTimeout(() => {
                    router.push('/patient/medical-form')
                }, 2000)
            }
        } catch (error) {
            setSubmitMessage({ type: 'error', message: 'Có lỗi xảy ra, vui lòng thử lại' })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8">
            <div className="max-w-3xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <BackButton />
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Tạo phiếu đăng ký khám</h1>
                                <p className="text-sm text-gray-500 mt-1">Vui lòng điền đầy đủ thông tin bên dưới</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Card chứa form */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                        
                        {/* Mô tả triệu chứng */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <span>Mô tả triệu chứng</span>
                                <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                placeholder="Vui lòng mô tả chi tiết các triệu chứng bạn đang gặp phải..."
                                className={`w-full border rounded-xl p-4 min-h-[120px] transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                                    errors.description 
                                        ? 'border-red-300 bg-red-50' 
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                {...register('description')}
                            />
                            {errors.description && (
                                <div className="flex items-center gap-1 text-sm text-red-600">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{errors.description.message}</span>
                                </div>
                            )}
                        </div>

                        {/* Tiền sử bệnh */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Tiền sử bệnh
                            </label>
                            <textarea
                                placeholder="Các bệnh đã từng mắc, thuốc đang dùng, tiền sử gia đình (nếu có)..."
                                className={`w-full border rounded-xl p-4 min-h-[100px] transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                                    errors.pastMedicalHistory 
                                        ? 'border-red-300 bg-red-50' 
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                {...register('pastMedicalHistory')}
                            />
                            {errors.pastMedicalHistory && (
                                <div className="flex items-center gap-1 text-sm text-red-600">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{errors.pastMedicalHistory.message}</span>
                                </div>
                            )}
                        </div>

                        {/* Upload hình ảnh */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" />
                                <span>Hình ảnh minh họa</span>
                                {previewImages.length > 0 && (
                                    <span className="text-xs text-gray-500">({previewImages.length} ảnh)</span>
                                )}
                            </label>
                            
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    id="image-upload"
                                    {...register('image')}
                                    onChange={(e) => {
                                        register('image').onChange(e)
                                        handleImageChange(e)
                                    }}
                                />
                                <label 
                                    htmlFor="image-upload"
                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                                >
                                    <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-600">Click để chọn ảnh</span>
                                    <span className="text-xs text-gray-400 mt-1">Hỗ trợ nhiều ảnh</span>
                                </label>
                            </div>

                            {/* Preview images với nút xóa */}
                            {previewImages.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {previewImages.map((url, index) => (
                                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                            <img 
                                                src={url} 
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Nút xóa */}
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                title="Xóa ảnh"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            {/* Overlay khi hover */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {errors.image && (
                                <div className="flex items-center gap-1 text-sm text-red-600">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{errors.image.message}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Message box */}
                    {submitMessage && (
                        <div className={`rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${
                            submitMessage.type === 'success'
                                ? 'bg-green-50 border border-green-200'
                                : 'bg-red-50 border border-red-200'
                        }`}>
                            {submitMessage.type === 'success' ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                            )}
                            <div>
                                <p className={`font-medium ${
                                    submitMessage.type === 'success' ? 'text-green-900' : 'text-red-900'
                                }`}>
                                    {submitMessage.type === 'success' ? 'Thành công!' : 'Có lỗi xảy ra'}
                                </p>
                                <p className={`text-sm mt-1 ${
                                    submitMessage.type === 'success' ? 'text-green-700' : 'text-red-700'
                                }`}>
                                    {submitMessage.message}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-4 px-6 rounded-xl font-semibold text-white shadow-lg transition-all transform ${
                            isSubmitting
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                        }`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Đang xử lý...
                            </span>
                        ) : (
                            'Tạo phiếu khám'
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}