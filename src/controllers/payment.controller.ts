import type { Request, Response } from "express";
import { createPayment } from "../services/payment.service";
import { TransactionModel } from "../models/transaction.model";

export const createPaymentHandler = async (req: Request, res: Response) => {
  try {
    const { amount, merchant_transaction_id, currency } = req.body;
    const merchant = req.merchant;

    if (!amount || !merchant_transaction_id || !currency) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const response = await createPayment({
      merchantId: merchant._id,
      amount,
      merchantTransactionId: merchant_transaction_id,
      currency,
    });

    res.json(response);
  } catch (err: any) {
    res.status(500).json({
      error: err.message || "Payment creation failed",
    });
  }
};

export const getPaymentStatusHandler = async (req: Request, res: Response) => {
  try {
    const { trade_id, merchant_transaction_id } = req.query;
    const merchant = req.merchant;

    if (!trade_id && !merchant_transaction_id) {
      return res.status(400).json({
        error: "Please provide trade_id or merchant_transaction_id",
      });
    }

    const query: any = { merchant: merchant._id }; // Authorization: Only find txns for this merchant
    if (trade_id) query.trade_id = trade_id;
    if (merchant_transaction_id) query.merchant_transaction_id = merchant_transaction_id;

    const transaction = await TransactionModel.findOne(query);

    if (!transaction) {
      return res.status(404).json({
        error: "Transaction not found",
      });
    }

    res.json({
      trade_id: transaction.trade_id,
      merchant_transaction_id: transaction.merchant_transaction_id,
      amount: transaction.amount,
      currency: transaction.currency,
      status: transaction.status,
      gateway_transaction_id: transaction.gateway_transaction_id,
      created_at: (transaction as any).createdAt,
      updated_at: (transaction as any).updatedAt,
    });

  } catch (err: any) {
    res.status(500).json({
      error: err.message || "Failed to fetch payment status",
    });
  }
};