import Account from "../models/Account.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find();
    res.status(200).json(accounts);
  } catch (error) {
    console.error("Lỗi khi gọi getAllAccount", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const createAccount = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const saltRound = 10;

    const hashedPassword = await bcrypt.hash(password, saltRound);
    const newAccount = await Account.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "Tạo account mới thành công",
      newAccount: newAccount,
    });
  } catch (error) {
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        message: "Lỗi đăng ký",
        errors: [{ msg: `${field} đã tồn tại trong hệ thống`, param: field }],
      });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => ({
        msg: err.message,
        param: err.path,
      }));
      return res
        .status(400)
        .json({ message: "Dữ liệu không hợp lệ", errors: messages });
    }
    console.error("Lỗi khi tạo account", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const account = await Account.findOne({ email }).select("+password"); // Khi login không được hide password

    if (!account)
      return res.status(400).json({ message: "Account không tồn tại" });
    if (!password)
      return res.status(400).json({ message: "Dữ liệu không hợp lệ" });

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Mật khẩu không khớp, vui lòng nhập lại!" });

    const token = jwt.sign({ _id: account._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const { password: pwd, ...accountWithoutPassword } = account.toObject(); // Ẩn trường password khi đăng nhập
    res.status(200).json({
      message: "Đăng nhập thành công",
      token: token,
      account: accountWithoutPassword,
    });
  } catch (error) {
    console.error("Lỗi khi đăng nhập", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
