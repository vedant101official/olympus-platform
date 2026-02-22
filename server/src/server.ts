import app from "./app";
import connectToDatabase from "./infrastructure/database/mongoose";
import { env } from "./core/config/env";
import logger from "./infrastructure/logger/logger";

async function startServer() {
  await connectToDatabase();

  app.listen(env.PORT, () => {
    logger.info(`Server is running on port ${env.PORT}`);
  });
}

startServer();