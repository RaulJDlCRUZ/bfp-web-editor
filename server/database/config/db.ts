// This file contains the "Pool": basically a connection pool for PostgreSQL.
import { Pool } from "pg";
import dotenv, { config } from "dotenv";

dotenv.config({ override: true });

function handleError(err: Error) {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
}

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});

pool.on("error", (err) => handleError(err));

export default pool;
