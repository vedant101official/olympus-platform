import express from "express";
import cors from "cors";
import helmet from "helmet";
import tenantRoutes from "./modules/tenants/tenants.routes";
import userRoutes from "./modules/users/user.routes";
import authRoutes from "./modules/auth/auth.routes";
import chatRoutes from "./modules/chat/chat.routes";
import { errorMiddleware } from "./core/middleware/error.middleware";
import { LogMiddleware, ResponseTimeLogMiddleware } from "./core/middleware/log.middleware";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// app levver middleware for logging request details
app.use(LogMiddleware);
app.use(ResponseTimeLogMiddleware);

// api calls for tenants, users, auth and chat
app.use("/api/tenants", tenantRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);

app.use(errorMiddleware);

app.get("/health", (req, res) => {
  console.log("Health route hit");
  res.status(200).json({ status: "OK" });
});

export default app;