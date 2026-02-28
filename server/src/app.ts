import express from "express";
import cors from "cors";
import helmet from "helmet";
import { get } from "mongoose";
import tenantRoutes from "./modules/tenants/tenants.routes";
import userRoutes from "./modules/users/user.routes";
import authRoutes from "./modules/auth/auth.routes";

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());


app.use("/api/tenants", tenantRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
  console.log("Health route hit");
  res.status(200).json({ status: "OK" });
});

export default app;