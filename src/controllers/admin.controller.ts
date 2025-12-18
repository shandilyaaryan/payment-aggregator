import type { Request, Response } from "express";
import { GatewayConfigModel } from "../models/gatewayConfig.model";
import { PaymentGateway } from "../constants/payments.constants";
import { GlobalPayProvider } from "../services/providers/globalpay.provider";

// Render the HTML UI
export const renderSwitchPage = async (req: Request, res: Response) => {
  try {
    // Find the currently active gateway
    const activeConfig = await GatewayConfigModel.findOne({ is_active: true });
    const currentGateway = activeConfig ? activeConfig.gateway : "NONE";

    // Get all available gateway options from our Enum
    const availableGateways = Object.values(PaymentGateway);

    res.render("admin-switch", {
      currentGateway,
      availableGateways,
      message: null,
    });
  } catch (err: any) {
    res.status(500).send("Error rendering page: " + err.message);
  }
};

export const debugSignGlobalPay = async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    const config = await GatewayConfigModel.findOne({
      gateway: PaymentGateway.GLOBALPAY,
    });
    if (!config) {
      return res.status(404).json({ error: "GlobalPay config not found" });
    }

    const provider = new GlobalPayProvider(config);
    // Remove 'sign' if present in payload to calculate signature correctly
    if (payload.sign) delete payload.sign;

    const signature = provider.generateSignature(payload);

    res.json({ signature });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Handle the switch action (API or Form POST)
export const switchGateway = async (req: Request, res: Response) => {
  try {
    const { gateway_name } = req.body;

    // Check if the provided gateway name is valid
    if (
      !gateway_name ||
      !Object.values(PaymentGateway).includes(gateway_name as PaymentGateway)
    ) {
      return res.status(400).json({ error: "Invalid gateway name" });
    }

    // 1. Deactivate all
    await GatewayConfigModel.updateMany({}, { is_active: false });

    // 2. Activate target
    const result = await GatewayConfigModel.findOneAndUpdate(
      { gateway: gateway_name },
      { is_active: true },
      { new: true }
    );

    if (!result) {
      // If the config for this gateway doesn't exist in DB yet, we might want to create a placeholder
      // or just return error. Returning error is safer.
      return res
        .status(404)
        .json({
          error: "Gateway config not found in DB. Please seed it first.",
        });
    }

    // 3. Response handling (HTML vs JSON)
    // If request accepts HTML (browser form submit), render the page with a success message
    if (req.accepts("html") && !req.xhr && !req.is("application/json")) {
      const availableGateways = Object.values(PaymentGateway);
      return res.render("admin-switch", {
        currentGateway: gateway_name,
        availableGateways,
        message: `Successfully switched to ${gateway_name}`,
      });
    }

    // Otherwise return JSON (API call)
    res.json({
      success: true,
      message: `Gateway switched to ${gateway_name}`,
      active_gateway: gateway_name,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
