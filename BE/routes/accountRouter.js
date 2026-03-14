import express from "express";
import {
  getAllAccounts,
  createAccount,
  Login,
  getMe
} from "../controllers/accountController.js";
export const accountRouter = express.Router();
import { createAccountValidationRule } from "../validator/accountValidator.js";
import {handleValidationError} from "../middlewares/ValidationErrorHandler/ValidationError.js"
import { authenticatedToken } from "../middlewares/AuthenticatedToken/AuthenticatedToken.js";
accountRouter.get('/get-me', authenticatedToken, getMe)
accountRouter.get("/", getAllAccounts);
accountRouter.post("/", createAccountValidationRule(), handleValidationError, createAccount);
accountRouter.post("/login", Login);