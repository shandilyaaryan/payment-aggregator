import { PaymentGateway } from "../constants/payments.constants";
import { GatewayConfigModel } from "../models/gatewayConfig.model";
import { MerchantModel } from "../models/merchant.model";
import { connectToDb } from "../config/db";
import dotenv from "dotenv";

dotenv.config();

const seed = async () => {
  await connectToDb();

  // 1. Seed GlobalPay Config
  const gpConfig = await GatewayConfigModel.findOne({
    gateway: PaymentGateway.GLOBALPAY,
  });
  if (!gpConfig) {
    await GatewayConfigModel.create({
      gateway: PaymentGateway.GLOBALPAY,
      base_url: "",
      merchant_id: "",
      // Using the long key provided in chat for both API and Secret key fields for now
      api_key:
        "",
      secret_key:
        "",
      use_proxy: true,
      proxy_url: "", // use proxy url here
      is_active: true,
    });
    console.log("Seeded GlobalPay Config");
  } else {
    console.log("GlobalPay Config already exists");
  }

  // 2. Seed Test Merchant
  const merchant = await MerchantModel.findOne({ merchant_id: "MERCH_123" });
  if (!merchant) {
    await MerchantModel.create({
      name: "Test Merchant",
      merchant_id: "MERCH_123",
      api_key: "merchant_api_key_here",
    });
    console.log("Seeded Test Merchant");
  } else {
    console.log("Test Merchant already exists");
  }

  process.exit(0);
};

seed();
