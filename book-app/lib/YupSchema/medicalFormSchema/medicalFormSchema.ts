import * as yup from "yup"

export const medicalFormSchema = yup.object({
    description: yup
    .string()
    .required("Vui lòng nhập mô tả")
    .min(10, "Mô tả phải có ít nhất 10 ký tự"),

    pastMedicalHistory: yup
    .string()
    .optional() 
    .transform((value) => value || undefined) 
    .min(10, "Vui lòng nhập ít nhất 10 ký tự"), 

    images: yup 
    .array()
    .of(yup.mixed<File>())
    .min(1, "Vui lòng chọn ít nhất 1 ảnh")
    .max(10, "Tối đa 10 ảnh")
    .optional()
})

export type MedicalFormInputs = yup.InferType<typeof medicalFormSchema>;
