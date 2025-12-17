import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

export const connectToDb = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to Mongo DB successfully");
  } catch (error) {
    console.log("Error while connecting to Mongo DB", error);
    process.exit(1);
  }
};
