import express from "express";
import { accountRouter } from "../routes/accountRouter.js";
import { patientRouter } from "../routes/patientRouter.js";
import { staffRouter } from "./staffRouter.js";
import { departmentRouter } from "./departmentRouter.js";
import { doctorRouter } from "./doctorRouter.js";
// import { paymentRouter } from "./paymentRouter.js";
import { momoRouter } from "./paymentMomo.js";

export const rootRouter = express.Router();

rootRouter.use("/v1/accounts", accountRouter);
rootRouter.use("/v1/patients", patientRouter);
rootRouter.use("/v1/staffs", staffRouter);
rootRouter.use("/v1/departments", departmentRouter);
rootRouter.use("/v1/doctors", doctorRouter);
// rootRouter.use("/payments", paymentRouter);
rootRouter.use("/payments-momo", momoRouter);