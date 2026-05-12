import http from "http";
import { Server } from "socket.io";
import app from "./app";
import connectToDatabase from "./infrastructure/database/mongoose";
import { env } from "./core/config/env";
import logger from "./infrastructure/logger/logger";
import { initSocket } from "./core/socket/socket";

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*"
  }
});
async function startServer() {
  await connectToDatabase();

  app.listen(env.PORT, () => {
    logger.info(`Server is running on port ${env.PORT}`);
  });
}

initSocket();
startServer();