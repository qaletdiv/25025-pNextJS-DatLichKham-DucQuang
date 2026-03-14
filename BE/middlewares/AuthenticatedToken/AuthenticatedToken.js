import jwt from "jsonwebtoken";
import Account from "../../models/Account.js";

export const authenticatedToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Yêu cầu xác thực token" });

  jwt.verify(token, process.env.JWT_SECRET, async (error, decodedPayload) => {
    if (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: "Token đã hết hạn!" });
      }
      return res
        .status(403)
        .json({ message: "Token không hợp lệ, vui lòng kiểm tra lại!" });
    }

    const accountId = decodedPayload._id;
    if (!accountId)
      return res
        .status(403)
        .json({ message: "Thiếu thông tin của người dùng" });

    try {
      const account = await Account.findOne({ _id: accountId });

      if (!account)
        return res.status(403).json({ message: "Thiếu thông tin người dùng" });

      req.account = account;
      next();
    } catch (error) {
      console.error("Lỗi khi kiểm tra token");
      return res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });
};
