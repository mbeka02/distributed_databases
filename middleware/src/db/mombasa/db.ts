import "dotenv";
import path from "path";
import { config } from "dotenv";

import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "../../../.env") });
import mysql from "mysql2/promise";
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
  port: parseInt(process.env.MYSQL_PORT!, 10),
  password: process.env.MYSQL_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export default pool;

// async function test() {
//   try {
//     const results = await pool.query("SELECT 1 as val");
//     console.log(results);
//   } catch (err) {
//     console.log("MySQL sucks =>", err);
//   }
// }

// test();
