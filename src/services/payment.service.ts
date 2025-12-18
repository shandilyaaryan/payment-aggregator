import type { Types } from "mongoose";
import { PaymentGateway, PaymentStatus } from "../constants/payments.constants";
import { GatewayConfigModel } from "../models/gatewayConfig.model";
import { TransactionModel } from "../models/transaction.model";
import { GlobalPayProvider } from "./providers/globalpay.provider";
import { v4 as uuidv4 } from "uuid";

export interface createPaymentInput {
  merchantId: Types.ObjectId;
  amount: number;
  merchantTransactionId: string;
  currency: string;
}

export const createPayment = async ({
  merchantId,
  amount,
  merchantTransactionId,
  currency,
}: createPaymentInput) => {
  const config = await GatewayConfigModel.findOne({
    gateway: PaymentGateway.GLOBALPAY,
    is_active: true,
  });
  if (!config) {
    throw new Error("GlobalPay config not foound");
  }
  const provider = new GlobalPayProvider(config);
  const tradeId = `TXN_${uuidv4()
    .replace(/-/g, "")
    .substring(0, 12)
    .toUpperCase()}`;

  const transaction = await TransactionModel.create({
    trade_id: tradeId,
    merchant_transaction_id: merchantTransactionId,
    merchant: merchantId,
    amount: amount,
    currency: currency,
    gateway: PaymentGateway.GLOBALPAY,
    status: PaymentStatus.PENDING,
  });
  try {
    const result = await provider.createPayment({
      amount,
      tradeId,
      merchantTxnId: merchantTransactionId,
      currency,
      callbackUrl: "http://localhost:3000/webhook/payment/globalpay", //TODO make it dynamic
    });

    transaction.gateway_transaction_id = result.gateway_transaction_id;
    transaction.raw_gateway_response = result.raw_gateway_response;
    await transaction.save();

    return {
      payment_url: result.payment_url,
      trade_id: tradeId,
      status: transaction.status,
    };
  } catch (error: any) {
    transaction.status = PaymentStatus.FAILED;
    transaction.raw_gateway_response = { error: error.message };
    await transaction.save();
    throw new Error("Payment instantiation failed");
  }
};
