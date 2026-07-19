import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { profileRouter } from "./routes/profile.js";
import { planRouter } from "./routes/plan.js";

export const app = express();
// Don't advertise the framework in response headers.
app.disable("x-powered-by");
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://gym-ai-dhaka.vercel.app",
  process.env.CLIENT_URL,
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
]
  .filter(Boolean)
  .map((o) => o as string);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow same-origin requests (no Origin header) and listed origins.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
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
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("[server] Unhandled error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  },
);

// Only listen when run directly (local dev). On Vercel the app is exported
// as a serverless handler via api/[[...path]].ts and must not call listen().
const isVercel = Boolean(process.env.VERCEL);
if (!isVercel && process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`[server] Listening on port ${PORT}`);
  });
}
