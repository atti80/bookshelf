import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

config({ path: ".env" });

const pool = new Pool({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PSWD,
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  database: process.env.DATABASE_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const db = drizzle({ client: pool, schema: schema });

console.log("connected to db...");
