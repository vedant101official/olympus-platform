import express from "express";
import cors from "cors";
import helmet from "helmet";
import { get } from "mongoose";

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/health", (req, res) => {
  console.log("Health route hit");
  res.status(200).json({ status: "OK" });
});

export default app;