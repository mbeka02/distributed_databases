import pg from 'pg'
const { Client } = pg
import "dotenv/config";
 
const client = new Client({
  connectionString: process.env.NAIROBI_URL
});

export default client;

async function test() {
  try {
    console.log("Je")
    const results = await client.query('SELECT $1::text as message', ['Hello world!']);
    console.log(results)
  } catch(err) {
    console.log("Dont want to see this =>", err);
  }
}
test();