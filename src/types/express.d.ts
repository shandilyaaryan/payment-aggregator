import type { IMerchant } from "../models/merchant.model";

declare global {
  namespace Express {
    interface Request {
      merchant: IMerchant;
    }
  }
}
export {};
