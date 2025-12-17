import { Router } from "express";

const paymentRouter = Router();

paymentRouter.post("/create", (req, res) => {
  res.json({
    message: "TODO",
  });
});

paymentRouter.get("/status", (req, res) => {
  res.json({
    message: "TODO",
  });
});

export default paymentRouter;
