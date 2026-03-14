import { body, param } from "express-validator";
import Account from "../models/Account.js";

export const createAccountValidationRule = () => {
  return [
    body("username")
      .notEmpty()
      .withMessage("Tên người dùng không được để trống")
      .isLength({ min: 6, max: 100 })
      .withMessage("Tên người dùng phải từ 6 đến 100 ký tự")
      .trim()
      .custom(async (username) => {
        const existedUsername = await Account.findOne({ username });
        if (existedUsername) {
          throw new Error(
            "Username đã tồn tại, vui lòng sử dụng username khác"
          );
        }
      }),

    body("email")
      .notEmpty()
      .withMessage("Email không được phép để trống")
      .isEmail()
      .withMessage("Email không đúng định dạng")
      .trim()
      .custom(async (email) => {
        const existedEmail = await Account.findOne({ email });
        if (existedEmail) {
          throw new Error("Email đã tồn tại, vui lòng sử dụng email khác");
        }
      }),

    body("password")
      .notEmpty()
      .withMessage("Mật khẩu không được phép để trống")
      .isLength({ min: 6, max: 100 })
      .withMessage("Mật khẩu phải từ 6 đến 100 ký tự")
      .trim()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}:\"<>?])[A-Za-z\d!@#$%^&*()_+{}:\"<>?]*$/
      )
      .withMessage(
        "Mật khẩu yêu cầu phải chứa một chữ in hoa, chữ cái thường, số và ký tự đặc biệt"
      )
      .matches(/^\S*$/)
      .withMessage("Mật khẩu không được chứa khoảng trắng"),
  ];
};
