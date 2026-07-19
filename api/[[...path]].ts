// Vercel serverless function: forwards all /api/* requests to the Express app.
// Vercel builds this with @vercel/node, which supports (req, res) handlers.
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { app } from "../server/src/index.js";

export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}
