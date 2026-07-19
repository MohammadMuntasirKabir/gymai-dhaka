// Vercel serverless function served at /api (via vercel.json rewrite of /api/*).
// The server is compiled to server/dist during `npm run build`.
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { app } from "../server/dist/index.js";

export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}
