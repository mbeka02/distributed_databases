import pg from "pg";
const { Pool } = pg;
import "dotenv/config";
const client = new Pool({
  connectionString: process.env.NAIROBI_URL,
});

export default client;

// async function test() {
//   try {
//     //explicitly connect the client before running the query
//     await client.connect();
//     console.log("Je");
//     const results = await client.query("SELECT $1::text as message", [
//       "Hello world!",
//     ]);
//     console.log("results=>", results);
//   } catch (err) {
//     console.log("Dont want to see this =>", err);
//   } finally {
//     //close the connection
//     await client.end();
//   }
// }
// test();
