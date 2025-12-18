import type { PaymentGateway } from "../../constants/payments.constants";

export interface CreatePaymentInput {
  amount: number;
  tradeId: string;
  merchantTxnId: string;
  currency: string;
  callbackUrl: string;
}

export interface PaymentCreationResult {
  payment_url: string;
  gateway_transaction_id?: string;
  raw_gateway_response?: any;
}

export interface IGatewayProvider {
  name: PaymentGateway;
  createPayment(input: CreatePaymentInput): Promise<PaymentCreationResult>;
  verifySignature?(payload: any, signature: string): boolean;
}
