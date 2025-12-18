import { Router } from "express";
import { handleWebhookController } from "../controllers/webhook.controller";

const webhookRouter = Router();

// Route for handling incoming webhooks from payment gateways
// The :gateway_name parameter allows us to support multiple gateways later if needed
webhookRouter.route("/payment/:gateway_name").post(handleWebhookController);

export default webhookRouter;
