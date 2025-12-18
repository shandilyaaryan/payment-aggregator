import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createPaymentHandler, getPaymentStatusHandler } from "../controllers/payment.controller";

const paymentRouter = Router();

// Routes for merchant payment operations
paymentRouter.route("/create").post(authMiddleware, createPaymentHandler);
paymentRouter.route("/status").get(authMiddleware, getPaymentStatusHandler);

export default paymentRouter;