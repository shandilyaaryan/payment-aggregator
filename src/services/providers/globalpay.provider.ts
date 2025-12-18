import { PaymentGateway } from "../../constants/payments.constants";
import type { IGatewayConfig } from "../../models/gatewayConfig.model";
import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import type {
  CreatePaymentInput,
  IGatewayProvider,
  PaymentCreationResult,
} from "./interfaces";
import crypto from "crypto";

export interface IRequestBody {
  merchantCode: string;
  merchantOrderId: string;
  amount: string;
  notifyUrl: string;
  requestTime: number;
  channelCode: "INRDLN001";
}
export class GlobalPayProvider implements IGatewayProvider {
  name = PaymentGateway.GLOBALPAY;
  private config: IGatewayConfig;

  constructor(config: IGatewayConfig) {
    this.config = config;
  }

  public generateSignature(params: Record<string, any>): string {
    // Get the keys and sort them
    const sortedKeys = Object.keys(params).sort();

    //Build the string: "amount=100&channnelCode=INR..."
    const signString = sortedKeys
      .filter((key) => params[key] !== undefined && params[key] !== "")
      .map((key) => `${key}=${params[key]}`)
      .join("&");

    // Add a secret key
    const stringToHash = signString + "&" + this.config.secret_key;

    // Create MD5 Hash
    return crypto
      .createHash("md5")
      .update(stringToHash)
      .digest("hex")
      .toLowerCase();
  }
  async createPayment(
    input: CreatePaymentInput
  ): Promise<PaymentCreationResult> {
    const requestBody: IRequestBody = {
      merchantCode: this.config.merchant_id,
      merchantOrderId: input.merchantTxnId,
      amount: input.amount.toFixed(4),
      notifyUrl: input.callbackUrl,
      requestTime: Math.floor(Date.now() / 1000),
      channelCode: "INRDLN001",
    };

    const signature = this.generateSignature(requestBody);
    const finalBody = { ...requestBody, sign: signature };
    const endpoint = `${this.config.base_url}/v1/b2b/payment-orders/place-order`;
    let agent;
    if (this.config.use_proxy && this.config.proxy_url) {
      agent = new HttpsProxyAgent(this.config.proxy_url);
    }
    try {
      const response = await axios.post(endpoint, finalBody, {
        proxy: false,
        httpsAgent: agent,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;
      if (data.code === "0000") {
        return {
          payment_url: data.data.upstreamLink,
          gateway_transaction_id: data.data.systemOrderId,
          raw_gateway_response: data,
        };
      } else {
        throw new Error(data.message || "GlobalPay Failed");
      }
    } catch (err: any) {
      console.error("GlobalPay Error", err.message);
      throw new Error("Payment gateway error");
    }
  }
  verifySignature(payload: any, signature: string): boolean {
    const payloadCopy = { ...payload };
    delete payloadCopy.sign;
    const sign = this.generateSignature(payloadCopy);
    if (sign === signature) return true;
    return false;
  }
}
