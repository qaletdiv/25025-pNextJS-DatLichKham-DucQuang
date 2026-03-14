import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";
import { rootRouter } from "./routes/rootRouter.js";
import { stripeWebhook } from "./controllers/paymentStripe.js";
import cors from "cors";
const app = express();
app.use(cors());
app.use(
  "/api/v1/payments-stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

app.use(express.json());
const port = process.env.PORT || 3001;

app.use("/api", rootRouter);

connectDB();
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
