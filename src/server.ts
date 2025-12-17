import { app } from "./app";
import { connectToDb } from "./config/db";

const PORT = process.env.PORT || 3000;

export const startServer = async () => {
  try {
    await connectToDb();
    app.listen(PORT, () => console.log("Server started"));
  } catch (err) {
    console.log("Error while starting server", err);
  }
};

startServer();
