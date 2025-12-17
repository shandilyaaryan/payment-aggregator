import { app } from "./app";

const PORT = process.env.PORT || 3000;

export const startServer = () => {
  try {
    app.listen(PORT, () => console.log("Server started"));
  } catch (err) {
    console.log("Error while starting server", err);
  }
};

startServer();
