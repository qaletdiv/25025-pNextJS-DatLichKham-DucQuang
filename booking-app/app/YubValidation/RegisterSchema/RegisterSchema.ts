import * as yup from "yup"

export const registerSchema = yup.object({
    username: yup 
    .string() 
    .required("Username bắt buộc"),

    email: yup 
    .string() 
    .email("Email không hợp lệ")
    .required("Email bắt buộc"), 

    password: yup 
    .string() 
    .min(6, "Mật khảu tối thiểu 6 ký tự")
    .required("Mật khẩu bắt buộc"),
     
    confirmedPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Mật khẩu xác nhận không khớp")
    .required("Vui lòng xác nhận mật khẩu"),
})