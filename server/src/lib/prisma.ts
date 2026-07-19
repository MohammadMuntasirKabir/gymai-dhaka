import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { parse } from "pg-connection-string";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set. Make sure dotenv/config is loaded before importing prisma.ts");
}

const parsed = parse(connectionString);

const pool = new Pool({
  user: parsed.user !== null ? parsed.user : undefined,
  password: parsed.password !== null ? parsed.password : undefined,
  host: parsed.host !== null ? parsed.host : undefined,
  port: parseInt(parsed.port !== null && parsed.port !== undefined ? parsed.port : "5432") || 5432,
  database: parsed.database !== null ? parsed.database : undefined,
  ssl: parsed.ssl === false ? false : { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });
