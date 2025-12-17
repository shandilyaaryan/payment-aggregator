import type { NextFunction, Request, Response } from "express";
import { MerchantModel } from "../models/merchant.model";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const apiKey = req.header("X-API-KEY");

    if (!apiKey) {
      return res.status(401).json({
        error: "X-API-KEY is missing",
      });
    }

    const merchant = await MerchantModel.findOne({ api_key: apiKey });

    if (!merchant) {
      return res.status(401).json({
        error: "Invalid API key",
      });
    }
    req.merchant = merchant;
    next();
  } catch (err) {
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
