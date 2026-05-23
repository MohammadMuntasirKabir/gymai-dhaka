import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { parse } from "pg-connection-string";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set. Make sure dotenv/config is loaded before importing prisma.ts");
}

const parsed = parse(connectionString);

const pool = new Pool({
  user: parsed.user,
  password: parsed.password,
  host: parsed.host,
  port: parseInt(parsed.port) || 5432,
  database: parsed.database,
  ssl: parsed.ssl === false ? false : { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });
