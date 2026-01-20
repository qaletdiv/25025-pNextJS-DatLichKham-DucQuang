import express from "express";
import {
  getAllAccounts,
  createAccount,
  Login
} from "../controllers/accountController.js";
export const accountRouter = express.Router();
import { createAccountValidationRule } from "../validator/accountValidator.js";
import {handleValidationError} from "../middlewares/ValidationErrorHandler/ValidationError.js"


accountRouter.get("/", getAllAccounts);
accountRouter.post("/", createAccountValidationRule(), handleValidationError, createAccount);
accountRouter.post("/login", Login);