import express from "express";
import paymentRouter from "./routers/payment.route";

export const app = express();

app.use(express.json({ limit: "16kb" }));

app.use("/api/merchant/payment", paymentRouter);
app.get("/health-check", (req, res) => {
  res.status(200).json({
    status: "OK",
  });
});
