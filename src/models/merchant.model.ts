import mongoose, { Document, Schema } from "mongoose";

export interface IMerchant extends Document {
  name: string;
  merchant_id: string;
  api_key: string; // We should hash before saving it TODO
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
