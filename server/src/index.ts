import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { profileRouter } from "./routes/profile";
import { planRouter } from "./routes/plan";

const app = express();
// Don't advertise the framework in response headers.
app.disable("x-powered-by");
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));

// API Routes
app.use("/api/profile", profileRouter);
app.use("/api/plan", planRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[server] Unhandled error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  // Server started
});
