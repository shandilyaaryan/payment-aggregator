import mongoose, { Schema } from "mongoose";

export interface IMerchant {
  name: string;
  merchant_id: string;
  api_key: string;
}

export const merchantSchema = new Schema<IMerchant>(
  {
    name: { type: String, required: true },
    merchant_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    api_key: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const MerchantModel = mongoose.model<IMerchant>(
  "Merchant",
  merchantSchema
);
