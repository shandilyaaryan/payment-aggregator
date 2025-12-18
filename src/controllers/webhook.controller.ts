import type { Request, Response } from "express";
import { handleWebhook } from "../services/webhook.service";

export const handleWebhookController = async (req: Request, res: Response) => {
  try {
    const { gateway_name } = req.params; // e.g., 'globalpay'
    if (!gateway_name) {
      return res.status(400).json({
        error_code: "1002",
        message: "Gateway name missing",
      });
    }
    const payload = req.body;
    
    // According to GlobalPay PDF, the signature is part of the payload itself
    // as the 'sign' field. It's not a separate header.
    const signature = payload.sign;

    if (!signature) {
      return res.status(400).json({
        error_code: "1001", // Custom error code for missing signature
        message: "Signature missing from payload",
      });
    }

    await handleWebhook(gateway_name, payload, signature);

    // GlobalPay expects { "error_code": "0000", "message": "Success" } on success
    res.json({
      error_code: "0000",
      message: "Success",
    });

  } catch (err: any) {
    console.error("Webhook Controller Error:", err.message);
    // GlobalPay webhook error response format (adjust as needed based on specific error codes)
    res.status(500).json({
      error_code: "9999", // Generic error code
      message: err.message || "Webhook processing failed",
    });
  }
};
