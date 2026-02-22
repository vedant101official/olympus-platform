import mongoose from "mongoose";
import { env } from "../../core/config/env";
import logger from "../logger/logger";

async function connectToDatabase() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

export default connectToDatabase;