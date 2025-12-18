import mongoose, { Document, Schema, type Types } from "mongoose";
import { PaymentGateway, PaymentStatus } from "../constants/payments.constants";

export interface ITransaction extends Document {
  trade_id: string;
  merchant_transaction_id: string;
  merchant: Types.ObjectId;
  amount: number;
  currency: string;
  gateway: PaymentGateway;
  status: PaymentStatus;
  gateway_transaction_id?: string;
  raw_gateway_response?: any;
  callback_url: string;
}

export const transactionSchema = new Schema<ITransaction>(
  {
    trade_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    merchant_transaction_id: {
      type: String,
      required: true,
      index: true,
    },
    merchant: {
      type: Schema.Types.ObjectId,
      ref: "Merchant",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    currency: {
      type: String,
      uppercase: true,
      required: true,
    },
    gateway: {
      type: String,
      enum: Object.values(PaymentGateway),
      required: true,
    },
    gateway_transaction_id: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    raw_gateway_response: {
      type: Schema.Types.Mixed,
    },
    callback_url: {
      type: String,
    },
  },
  { timestamps: true }
);

export const TransactionModel = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema
);
