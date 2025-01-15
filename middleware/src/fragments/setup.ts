import db from "../db";
import pool from "../db/kisumu/db";
import client from "../db/nairobi/db";
import { sales } from "../db/schema";

interface sales {
    id: number,
    product_id: number,
    employee_id: number,
    store_id: number,
    price: number,
    timestamp: Date
}

export async function setupSales() {
    console.log("Setting up sales global relation");
    
    // Pull data from Kisumu
    await pool.query("USE distributed_db");
    const query = "SELECT * FROM Sales1";
    const sales1 = await pool.query<sales[]>(query, []);
    
    // Pull data from Nairobi
    await client.connect();
    const sales2 = await client.query<sales>("SELECT * FROM Sales2");
    const sales3 = await client.query<sales>("SELECT * FROM Sales3");
    
    
    const Sales: sales[] = [...sales1, ...sales2.rows, ...sales3.rows]

    // Update global relation
    await db.insert(sales).values(Sales);
}

setupSales()


export async function setupProducts() {
    console.log("Setting up products global relation");
}

export async function setupStores() { 
    console.log("Setting up stores");
}

export async function setupInventory() {
    console.log("Setting up inventory");
}

export async function setupEmployees() {
    console.log("Setting up employees");
}