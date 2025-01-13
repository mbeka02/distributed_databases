import mariadb from "mariadb";
import "dotenv/config";

const pool = mariadb.createPool({
     host: process.env.MARIADB_HOST, 
     user:process.env.MARIADB_USER, 
     password: process.env.MARIADB_PASSWORD,
     connectionLimit: process.env.MARIADB_CONNECTION_LIMIT
});

export default pool;