import express from "express";
import { createStripePayment, stripeWebhook } from "../controllers/paymentStripe.js";
import { authorize } from "../middlewares/Authorize/Authorize.js";
import { authenticatedToken } from "../middlewares/AuthenticatedToken/AuthenticatedToken.js";

export const stripeRouter = express.Router();

stripeRouter.post("/", authenticatedToken, authorize("patient"), createStripePayment);
// stripeRouter.post("/webhook",express.raw({ type: "application/json" }), stripeWebhook);
