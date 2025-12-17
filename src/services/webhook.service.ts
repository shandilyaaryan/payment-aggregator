// This file handles payment status updates coming from globalpay(webhooks)

import axios from "axios";
import { PaymentGateway, PaymentStatus } from "../constants/payments.constants";
import { GatewayConfigModel } from "../models/gatewayConfig.model";
import { TransactionModel } from "../models/transaction.model";
import { GlobalPayProvider } from "./providers/globalpay.provider";

export const handleWebhook = async (
  gatewayName: string,
  payload: any,
  signature: string
) => {
  if (gatewayName.toUpperCase() !== PaymentGateway.GLOBALPAY) {
    throw new Error("Unsupported gateway");
  }

  const config = await GatewayConfigModel.findOne({
    gateway: PaymentGateway.GLOBALPAY,
    is_active: true,
  });

  if (!config) {
    throw new Error("Gateway Config not found");
  }

  const provider = new GlobalPayProvider(config);

  if (!provider.verifySignature(payload, signature)) {
    throw new Error("Invalid Signature");
  }

  const txn = await TransactionModel.findOne({
    merchant_transaction_id: payload.payment_cl_id,
  });

  if (!txn) {
    throw new Error("Transaction not found");
  }

  if (txn.status === PaymentStatus.SUCCESS) {
    return { message: "Already processed" };
  }

  const status =
    payload.status === 2 ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;
  txn.status = status;
  txn.gateway_transaction_id = payload.payment_id;
  txn.raw_gateway_response = payload;
  await txn.save();

  if (txn.callback_url) {
    try {
      await axios.post(txn.callback_url, {
        status: status,
        trade_id: txn.trade_id,
        merchant_transaction_id: txn.merchant_transaction_id,
      });
    } catch (err) {
      console.error("Failed to notify merchant", err);
    }
  }
  return { success: true };
};
