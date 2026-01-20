/** PENDING */

// // paymentController.js (toàn bộ file, copy-paste thay hết)

// import { VNPay, ignoreLogger, VnpLocale, dateFormat } from "vnpay";
// import Appointment from "../models/Appointment.js";
// import Payment from "../models/Payment.js";

// // Khởi tạo VNPay một lần
// const vnpay = new VNPay({
//   tmnCode: process.env.VN_PAY_TMNCODE,
//   secureSecret: process.env.VN_PAY_HASHSECRET,
//   vnpayHost: process.env.VN_PAY_HOST,
//   testMode: true,
//   hashAlgorithm: "SHA512",
//   loggerFn: ignoreLogger,
// });

// export const createPaymentUrl = async (req, res) => {
//   try {
//     if (!req.body?.appointmentId) {
//       return res.status(400).json({ message: "Thiếu appointmentId" });
//     }

//     const txnRef = Date.now().toString();

//     const appointment = await Appointment.findById(req.body.appointmentId);
//     if (!appointment) {
//       return res.status(404).json({ message: "Không tìm thấy lịch hẹn" });
//     }

//     const now = new Date();
//     const expireDate = new Date(now);
//     expireDate.setMinutes(expireDate.getMinutes() + 15);

//     const paymentUrl = await vnpay.buildPaymentUrl({
//       vnp_Amount: appointment.price, // Giữ nguyên như bạn muốn (VNPay sẽ xử lý nhân 100 nếu cần)
//       vnp_IpAddr: req.ip || "127.0.0.1",
//       vnp_TxnRef: txnRef,
//       vnp_OrderInfo: `Thanh toán lịch khám - ID: ${appointment._id}`,
//       vnp_ReturnUrl: "http://localhost:5000/api/payments/vnpay_return", // Quay lại localhost
//       vnp_Locale: VnpLocale.VN,
//       vnp_CreateDate: dateFormat(now),
//       vnp_ExpireDate: dateFormat(expireDate),
//     });

//     await Payment.create({
//       appointmentId: appointment._id,
//       amount: appointment.price,
//       provider: "vnpay",
//       status: "pending",
//       txnRef: txnRef,
//     });

//     console.log("TẠO PAYMENT THÀNH CÔNG - TxnRef:", txnRef);
//     return res.status(201).json({ url: paymentUrl });
//   } catch (error) {
//     console.error("VNPAY CREATE ERROR:", error);
//     return res.status(500).json({ message: "Lỗi tạo URL thanh toán" });
//   }
// };

// export const vnpayReturn = async (req, res) => {
//   try {
//     const verify = vnpay.verifyReturnUrl(req.query);

//     console.log("RETURN VERIFY RESULT:", verify);

//     if (verify.isSuccess && verify.isVerified) {
//       // Cập nhật DB chi tiết hơn
//       const updatedPayment = await Payment.findOneAndUpdate(
//         { txnRef: verify.vnp_TxnRef },
//         {
//           status: "successful",
//           transactionId: verify.vnp_TransactionNo || null,
//           bankCode: verify.vnp_BankCode || null,
//           paidAt: new Date(),
//           responseCode: verify.vnp_ResponseCode,
//         },
//         { new: true }
//       );

//       console.log("RETURN ĐÃ CẬP NHẬT DB THÀNH CÔNG:", updatedPayment);

//       // Trang thông báo đẹp, chuyên nghiệp
//       return res.send(`
//         <!DOCTYPE html>
//         <html lang="vi">
//         <head>
//           <meta charset="utf-8">
//           <title>Thanh toán thành công</title>
//           <style>
//             body { font-family: Arial, sans-serif; text-align: center; margin-top: 80px; background: #f0f8ff; }
//             .container { max-width: 600px; margin: 0 auto; padding: 30px; background: white; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
//             .success { color: #28a745; font-size: 42px; font-weight: bold; margin-bottom: 20px; }
//             .info { font-size: 20px; line-height: 1.8; }
//             .info strong { color: #333; }
//             .note { margin-top: 30px; color: #666; font-style: italic; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <h1 class="success">THANH TOÁN THÀNH CÔNG!</h1>
//             <div class="info">
//               <p><strong>Mã đơn hàng:</strong> ${verify.vnp_TxnRef}</p>
//               <p><strong>Số tiền:</strong> ${(verify.vnp_Amount / 100).toLocaleString('vi-VN')} VNĐ</p>
//               <p><strong>Mã giao dịch VNPay:</strong> ${verify.vnp_TransactionNo || "Chưa có"}</p>
//               <p><strong>Ngân hàng:</strong> ${verify.vnp_BankCode || "Không rõ"}</p>
//             </div>
//             <p class="note">
//               Trạng thái thanh toán trong hệ thống đã được cập nhật thành <strong>successful</strong>.<br>
//               Bạn có thể đóng tab này và quay lại ứng dụng.
//             </p>
//           </div>
//         </body>
//         </html>
//       `);
//     } else {
//       // Thanh toán thất bại
//       await Payment.findOneAndUpdate(
//         { txnRef: verify.vnp_TxnRef },
//         {
//           status: "failed",
//           responseCode: verify.vnp_ResponseCode,
//         }
//       );

//       console.log("RETURN: THANH TOÁN THẤT BẠI - Mã lỗi:", verify.vnp_ResponseCode);

//       return res.send(`
//         <!DOCTYPE html>
//         <html lang="vi">
//         <head>
//           <meta charset="utf-8">
//           <title>Thanh toán thất bại</title>
//           <style>
//             body { font-family: Arial, sans-serif; text-align: center; margin-top: 80px; background: #fff0f0; }
//             .container { max-width: 600px; margin: 0 auto; padding: 30px; background: white; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
//             .failed { color: #dc3545; font-size: 42px; font-weight: bold; margin-bottom: 20px; }
//             .info { font-size: 20px; line-height: 1.8; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <h1 class="failed">THANH TOÁN THẤT BẠI HOẶC BỊ HỦY</h1>
//             <div class="info">
//               <p><strong>Mã lỗi:</strong> ${verify.vnp_ResponseCode}</p>
//               <p><strong>Mã đơn hàng:</strong> ${verify.vnp_TxnRef}</p>
//             </div>
//             <p>Vui lòng thử thanh toán lại hoặc liên hệ hỗ trợ.</p>
//           </div>
//         </body>
//         </html>
//       `);
//     }
//   } catch (error) {
//     console.error("RETURN ERROR:", error);
//     return res.status(500).send("Lỗi xử lý kết quả thanh toán từ VNPay");
//   }
// };