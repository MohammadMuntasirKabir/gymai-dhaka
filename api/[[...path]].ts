// Vercel serverless function: forwards all /api/* requests to the Express app.
// The server is compiled to server/dist during `npm run build`, so we import
// the built entry here. Vercel deploys server/dist alongside this function.
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { app } from "../server/dist/index.js";

export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}
