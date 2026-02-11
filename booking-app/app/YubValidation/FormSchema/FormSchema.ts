import * as yup from "yup";

export const creatFormSchema = yup.object({
  description: yup
    .string()
    .required("Vui lòng nhập mô tả triệu chứng")
    .min(10, "Mô tả ít nhất 10 ký tự"),

  pastMedicalHistory: yup.string().optional(),

  image: yup.mixed().optional(),
});
