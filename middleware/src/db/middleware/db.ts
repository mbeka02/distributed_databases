import pg from "pg";
const { Pool } = pg;
import "dotenv/config";
const client = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default client;