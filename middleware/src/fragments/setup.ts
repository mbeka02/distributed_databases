import db from "../db";
import pool from "../db/kisumu/db";
import mysqlPool from "../db/mombasa/db";
import client from "../db/nairobi/db";
import { employees, inventory, products, sales, stores } from "../db/schema";

interface sales {
    id: number,
    product_id: number,
    employee_id: number,
    store_id: number,
    price: number,
    timestamp: Date
}

interface Product {
    id: number,
    name: string,
    barcode: string,
    price: number,
    discount: number
}

interface Store {
    id: number,
    name: string,
    address: string
}

interface Inventory {
    id: number,
    product_id: number,
    store_id: number,
    item_count: number,
}

interface Employee {
    id: number,
    full_name: string,
    dob: Date,
    work_email: string,
    phone_number: string,
    salary: number,
    jobtitle: string,
    store_id: number
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

export async function setupProducts() {
    console.log("Setting up products global relation");

    // Get products from Nairobi
    await client.connect();
    const productRows = await client.query<Product>("SELECT * FROM Products");

    // Insert into global relation
    await db.insert(products).values(productRows.rows);
}

export async function setupStores() { 
    console.log("Setting up stores");

    // Get stores from nairobi
    await client.connect();
    const stores1rows = await client.query<Store>("SELECT * FROM Stores1");
    const stores2rows = await client.query<Store>("SELECT * FROM Stores2");
    const stores3rows = await client.query<Store>("SELECT * FROM Stores3");

    const storeRows: Store[] = [...stores1rows.rows, ...stores2rows.rows, ...stores3rows.rows]
    // Insert in global relation
    await db.insert(stores).values(storeRows);
}

export async function setupInventory() {
    console.log("Setting up inventory");

    await client.connect();

    // Fetch from nairobi
    const inventory3 = await client.query<Inventory>("SELECT * FROM Inventory3");

    // Fetch from kisumu
    const conn = await pool.getConnection();
    await conn.query("USE distributed_db", []);
    const inventory1 = await conn.query<Inventory[]>("SELECT * FROM Inventory1", []);
    console.log("Done 2");

    // Fetch from mombasa
    // await mysqlPool.query("USE distributed_db")
    // const inventory2 = await mysqlPool.query("SELECT * FROM Inventory2");
    // console.log(inventory2);

    const inventoryRows: Inventory[] = [...inventory1, ...inventory3.rows];
    await db.insert(inventory).values(inventoryRows);
}

export async function setupEmployees() {
    console.log("Setting up employees");

    // Fetch from nairobi
    await client.connect();
    const employeeRows = await client.query<Employee>("SELECT * FROM Employees");
    
    const employeeR = employeeRows.rows.map((r) => {
        return {
            id: r.id,
            dob: r.dob,
            name: r.full_name,
            work_email: r.work_email,
            phone_number: r.phone_number,
            sex: "M",
            salary: r.salary,
            jobTitle: r.jobtitle,
            store_id: r.store_id
        }
    });

    // Insert in global relation
    await db.insert(employees).values(employeeR);
}

(async () => {
    await setupInventory();
    await setupSales();
})();