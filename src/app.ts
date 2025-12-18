import express from "express";
import paymentRouter from "./routers/payment.route";
import webhookRouter from "./routers/webhook.route";
import adminRouter from "./routers/admin.route";
import path from "path";

export const app = express();

// View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true })); // Parse form data

app.use("/api/merchant/payment", paymentRouter);
app.use("/webhook", webhookRouter);
app.use("/admin", adminRouter);

app.get("/health-check", (req, res) => {
  res.status(200).json({
    status: "OK",
  });
});
