import mongoose, { Schema } from "mongoose";
import { PaymentGateway } from "../constants/payments.constants";

export interface IGatewayConfig {
  gateway: PaymentGateway;
  base_url: string;
  merchant_id: string;
  api_key?: string;
  secret_key?: string;
  use_proxy: boolean;
  proxy_url?: string;
  is_active: boolean;
}

export const gatewayConfigSchema = new Schema<IGatewayConfig>(
  {
    gateway: {
      type: String,
      enum: Object.values(PaymentGateway),
      required: true,
      unique: true,
    },
    base_url: {
      type: String,
      required: true,
    },
    merchant_id: {
      type: String,
    },
    api_key: {
      type: String,
    },
    secret_key: {
      type: String,
    },
    use_proxy: {
      type: Boolean,
      default: false,
    },
    proxy_url: {
      type: String,
    },
    is_active: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const GatewayConfigModel = mongoose.model<IGatewayConfig>(
  "GatewayConfig",
  gatewayConfigSchema
);
