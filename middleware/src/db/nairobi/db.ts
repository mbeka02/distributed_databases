import pg from "pg";
const { Client } = pg;
import path from "path";
import { config } from "dotenv";

import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "../../../.env") });
const client = new Client({
  connectionString: process.env.NAIROBI_URL,
});

export default client;

async function test() {
  try {
    //explicitly connect the client before running the query
    await client.connect();
    console.log("Je");
    const results = await client.query("SELECT $1::text as message", [
      "Hello world!",
    ]);
    console.log("results=>", results);
  } catch (err) {
    console.log("Dont want to see this =>", err);
  } finally {
    //close the connection
    await client.end();
  }
}
test();
