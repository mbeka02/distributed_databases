import mysql from "mysql2/promise";
import "dotenv/config";

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
    password: process.env.MYSQL_PASSWORD
  });

export default pool;

async function test() {
  try {
    const results = await pool.query("SELECT 1 as val");
    console.log(results);
  } catch(err) {
    console.log("MySQL sucks =>", err);
  }
}

test();