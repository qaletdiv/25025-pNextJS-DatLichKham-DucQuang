import express from "express";
import { createPaymentMomo, momoReturn, momoIpn } from "../controllers/paymentMomoController.js";

export const momoRouter = express.Router();

momoRouter.post("/create-payment-momo", createPaymentMomo);
momoRouter.get("/momo-return", momoReturn);
momoRouter.post("/momo-ipn", momoIpn);
 