import mariadb from "mariadb";
import path from "path";
import { config } from "dotenv";

import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "../../../.env") });

console.log(
  process.env.MARIADB_HOST,
  process.env.MARIADB_USER,
  process.env.MARIADB_PASSWORD,
  process.env.MARIADB_CONNECTION_LIMIT,
  process.env.MARIADB_PORT,
);

const pool = mariadb.createPool({
  host: process.env.MARIADB_HOST,
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  connectionLimit: parseInt(process.env.MARIADB_CONNECTION_LIMIT!, 10),
  port: parseInt(process.env.MARIADB_PORT!, 10),
});

export default pool;

async function test() {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query("SELECT 1 as val");
    console.log(result);
  } catch (err) {
    console.log("Dumb fucking error =>", err);
  }
}

test();
