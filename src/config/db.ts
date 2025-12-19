import mongoose from "mongoose";

export const connectToDb = async () => {
  const mongo_uri = process.env.MONGO_URI!;

  if (!mongo_uri) {
    throw new Error("Mongo db url not found in dotenv");
  }
  try {
    await mongoose.connect(mongo_uri);
    console.log("Connected to Mongo DB successfully");
  } catch (error) {
    console.log("Error while connecting to Mongo DB", error);
    process.exit(1);
  }
};
