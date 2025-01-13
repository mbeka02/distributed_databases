import pg from 'pg'
const { Client } = pg
import "dotenv/config";
 
const client = new Client({
  connectionString: process.env.NAIROBI_URL
});

export default client;