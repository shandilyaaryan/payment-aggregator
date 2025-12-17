import express from "express";

export const app = express();

app.use(express.json({ limit: "16kb" }));

app.get("/health-check", (req, res) => {
  res.status(200).json({
    status: "OK",
  });
});
