import mariadb from "mariadb";
import "dotenv/config";

console.log(process.env.MARIADB_HOST, process.env.MARIADB_USER, process.env.MARIADB_PASSWORD, process.env.MARIADB_CONNECTION_LIMIT, process.env.MARIADB_PORT);

const pool = mariadb.createPool({
     host: process.env.MARIADB_HOST, 
     user:process.env.MARIADB_USER, 
     password: process.env.MARIADB_PASSWORD,
     connectionLimit: process.env.MARIADB_CONNECTION_LIMIT,
     port: process.env.MARIADB_PORT
});

export default pool;

async function test() {
     try {
          const connection = await pool.getConnection();
          const result = await connection.query("SELECT 1 as val");
          console.log(result);
     } catch(err) {
          console.log("Dumb fucking error =>", err);
     }
}

test();