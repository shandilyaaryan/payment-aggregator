import { PaymentGateway } from "../constants/payments.constants";
import { GatewayConfigModel } from "../models/gatewayConfig.model";
import { MerchantModel } from "../models/merchant.model";
import { connectToDb } from "../config/db";
import dotenv from "dotenv";

dotenv.config();

const seed = async () => {
  await connectToDb();

  // 1. Seed GlobalPay Config
  const gpConfig = await GatewayConfigModel.findOne({ gateway: PaymentGateway.GLOBALPAY });
  if (!gpConfig) {
    await GatewayConfigModel.create({
      gateway: PaymentGateway.GLOBALPAY,
      base_url: "https://api.xyz66688.com",
      merchant_id: "IN0012",
      // Using the long key provided in chat for both API and Secret key fields for now
      api_key:
        "346e4d3b3bbcb010b1fb2171e1d2c58ecf990f1cd1d3907705e299b144df5dcc080edd68e8a50f7478fe1e6972d25d19e3a0faacebcc889ba4c93a2d68eafbf4",
      secret_key:
        "346e4d3b3bbcb010b1fb2171e1d2c58ecf990f1cd1d3907705e299b144df5dcc080edd68e8a50f7478fe1e6972d25d19e3a0faacebcc889ba4c93a2d68eafbf4",
      use_proxy: true,
      proxy_url: "https://testdev:s5Yk5GkhiC@prx-srv.inboxo.me:8443",
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
      api_key: "merchant_api_key_here" 
    });
    console.log("Seeded Test Merchant");
  } else {
    console.log("Test Merchant already exists");
  }

  process.exit(0);
};

seed();
