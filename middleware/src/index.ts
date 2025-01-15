import Express, { json } from "express";
import { myDB } from "./lmdb";
import { SETUP_KEY } from "./constants";
import { relationSetupConfig } from "./global_directory";
import db from "./db";
import { employees, inventory, products, sales, stores } from "./db/schema";
import { and, between, count, eq } from "drizzle-orm";
import { addEmployeeSchema, customerPurchase, createDiscountSchema, updateInventorySchema } from "./schema";
import client from "./db/nairobi/db";
import pool from "./db/kisumu/db";

const app = Express();
const PORT = 10000;
app.use(json());
app.get("/test", (req, res) => {
  res.send("Test");
});
//endpoint for each of the external schemas
//Store managers will be checking stock levels for their branch daily
app.get("/checkStock/:storeId", async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    if (isNaN(storeId)) {
      res.status(400).json({ error: "Invalid storeId parameter" });
    }
    const stock = await db
      .select({
        productId: products.id,
        barcode: products.barcode,
        count: count(),
      })
      .from(inventory)
      .innerJoin(products, eq(products.id, inventory.product_id))
      .where(eq(inventory.store_id, storeId));
    res.status(200).json({ stock: stock || [] });
  } catch (error) {
    console.error("Error fetching stock data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//Store managers will be restocking when inventory is low daily
app.patch("/updateInventory/:storeId", async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    if (isNaN(storeId)) {
      res.status(400).json({ error: "Invalid storeId parameter" });
    }
    const body = req.body;
    const parsed = updateInventorySchema.safeParse(body);

    if (!parsed.success) {
      res.status(400).json({ error: `validation error: ${parsed.error}` });
    } else {
      const { data } = parsed;
      // update the middleware db first
      await db
        .update(inventory)
        .set({
          item_count: data.item_count,
        })
        .where(
          and(
            eq(inventory.product_id, data.product_id),
            eq(inventory.store_id, storeId),
          ),
        );
      await client.connect();
      // Define the table name based on the storeId
      const tableName = `Inventory${storeId}`;

      // Ensure the storeId is valid
      if ([1, 2, 3].includes(storeId)) {
        const query = `UPDATE ${tableName} SET item_count = $1 WHERE store_id = $2 AND product_id = $3`;
        const values = [data.item_count, storeId, data.product_id];
        await client.query(query, values);
      } else {
        res.status(400).json({ error: "Invalid storeId provided" });
      }
      res.status(200).json({ message: "successfully restocked" });
      await client.end();
    }
  } catch (error) {
    console.error("Error upadting the inventory:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//Store managers will be adding employee records monthly
//Store managers will be updating employee records monthly
//Store managers will be removing employee records monthly
//Cashiers will record customer purchases daily
//Cashiers will submit total sales made to store managers daily
app.get("/totalSales/:storeId", async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    if (isNaN(storeId)) {
      res.status(400).json({ error: "Invalid storeId parameter" });
    }

    const now = new Date();

    // Get the start of today (midnight)
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    // Get the end of today (11:59:59.999 PM)
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      -1,
    );

    const totalSales = await db
      .select()
      .from(sales)
      .where(
        and(
          eq(sales.store_id, storeId),
          between(sales.timestamp, startOfDay, endOfDay),
        ),
      );

    res.status(200).json({ totalSales: totalSales || [] });
  } catch (error) {
    console.error(`error checking the total sales: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//Warehouse staff will be incharge of performing physical inventory counts at the end of day at their store
//The supply chain team will track inventory levels across locations weekly
app.get("/trackInventory", async (req, res) => {
  try {
    const currentInvetory = await db
      .select({
        productId: products.id,
        productName: products.name,

        count: count(products.id),
        storeName: stores.name,
        storeAddress: stores.address,
      })
      .from(inventory)
      .innerJoin(products, eq(products.id, inventory.product_id))
      .innerJoin(stores, eq(stores.id, inventory.id))
      .groupBy(inventory.product_id);

    res.status(200).json({ currentInvetory: currentInvetory || [] });
  } catch (error) {
    console.error(`error checking the inventory levels: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//The marketing team will create item discounts weekly
app.patch("/createDiscount", async (req, res) => {
  try {
    const body = req.body;
    const parsed = createDiscountSchema.safeParse(body);

    if (!parsed.success) {
      res.status(400).json({ error: `validation error: ${parsed.error}` });
    } else {
      const { data } = parsed;
      // update the middleware db first
      await db
        .update(products)
        .set({
          discount: data.discount,
        })
        .where(eq(products.id, data.product_id));
      await client.connect();

      const query = `UPDATE Products SET discount=$1 WHERE product_id=$2`;
      const values = [data.discount, data.product_id];
      await client.query(query, values);
      res
        .status(400)
        .json({ message: "the discount has been applied to teh product" });
      await client.end();
    }
  } catch (error) {
    console.error("Error upadting the inventory:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//The accounts team will get employee salaries monthly
app.get("/getSalaries", async (req, res) => {
  try {
    const salaries = await db.select().from(employees);
    res.status(200).json({ employees: employees || [] });
  } catch (error) {
    console.error(`error fetching employee salaries: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//The executive will be generating reports on sales of all locations monthly
app.get("/generateReport", async (req, res) => {
  try {
    const reportsData = await db
      .select()
      .from(sales)
      .innerJoin(products, eq(products.id, sales.id))
      .groupBy(sales.store_id, products.id);
    res.status(200).json({ reportsData: reportsData || [] });
  } catch (error) {
    console.error(`error getting the reports data: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/addEmployee", async (req, res) => {
  try {
    const parsed = addEmployeeSchema.safeParse(req.body);
    if (parsed.success) {
      const data = parsed.data;
      // Update materialized view
      const employeeID = await db.insert(employees).values({
        name: data.name,
        dob: new Date(data.dob),
        work_email: data.work_email,
        phone_number: data.phone_number,
        sex: "M",
        salary: data.salary,
        jobTitle: data.job_title,
        store_id: data.store_id
      }).returning({id: employees.id});

      // Update fragment
      await client.connect();
      await client.query(
        "INSERT INTO Employees (id, full_name, dob, work_email, phone_number, salary, jobTitle, store_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)"
        , [employeeID[0].id, data.name, data.dob, data.work_email, data.phone_number, data.salary, data.job_title, data.store_id]);
      res.status(201).json({message: "Employee Added"});
      } else {
      const messages = parsed.error.issues.map((i) => i.message);
      res.status(400).json({errors: messages});
    }
  } catch(err) {
    await client.end();
    console.log("Internal server error", err);
    res.status(500).json({message: "Internal Server Error"});
  }
});

app.patch("/updateEmployee/:id", async (req, res) => {
  try {
    const salary = Number.parseFloat(req.body.salary);
    const id = Number.parseInt(req.params.id);
    // Update materialized view
    await db.update(employees).set({
      salary: salary
    }).where(eq(employees.id, id));

    // Update fragment
    await client.connect();
    await client.query("UPDATE Employees SET salary = $1 WHERE id = $2", [salary, id]);
    res.status(201).json({message: "Updated Employee Successfully"});
  } catch(err) {
    await client.end();
    console.log("Internal sever error", err);
    res.status(500).json({error: "Internal Server Error"});
  }
});

app.delete("/removeEmployee/:id", async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id);

    // Update materialized view
    await db.delete(employees).where(eq(employees.id, id));

    // Update fragment
    await client.connect();
    await client.query("DELETE FROM Employees WHERE id=$1", [id]);
    res.status(201).json({message: "Employee Record Deleted Succesfully"});
  } catch(err) {
    await client.end();
    console.log("Internal server error", err);
    res.status(500).json({error: "Internal Server Error"});
  }
});

app.post("/customerPurchase", async (req, res) => {
  try {
    const parsed = customerPurchase.safeParse(req.body);
    if (parsed.success) {
      const data = parsed.data;
      // Update materialized view
      const saleID = await db.insert(sales).values({
        price: data.price,
        product_id: data.product_id,
        employee_id: data.employee_id,
        store_id: data.store_id,
        timestamp: new Date(data.timestamp)
      }).returning({id: sales.id});

      // Update fragment
      if (data.store_id === 2) {
        await client.connect();
        client.query("INSERT INTO Sales2 (id, product_id, employee_id, store_id, price, timestamp) VALUES ($1, $2, $3, $4, $5, $6)",
          [saleID[0].id, data.product_id, data.employee_id, data.store_id, data.price, data.timestamp]
        )
      } else if (data.store_id === 3) {
        await client.connect();
        client.query("INSERT INTO Sales3 (id, product_id, employee_id, store_id, price, timestamp) VALUES ($1, $2, $3, $4, $5, $6)", 
          [saleID[0].id, data.product_id, data.employee_id, data.store_id, data.price, data.timestamp])
      } else if (data.store_id == 1) {
        const connection = await pool.getConnection();
        await connection.query("INSERT INTO Sales1 (id, product_id, employee_id, store_id, price, timestamp) VALUES (?, ?, ?, ?, ?, ?)"
          , [saleID[0].id, data.product_id, data.employee_id, data.store_id, data.price, data.timestamp]);

        connection.end();
      }
    } else {
      const errors = parsed.error.issues.map((i) => i.message);
      res.status(400).json({errors});
    }
  } catch(err) {
    await client.end();
    console.log("Internal Server Error", err);
    res.status(500).json({error: "Internal Server Error"});
  }
})

app.listen(PORT, async () => {
  let hasSetup = myDB.get(SETUP_KEY);
  if (hasSetup !== "true") {
    // Setup global relations
    for (const [key, value] of Object.entries(relationSetupConfig)) {
      value();
    }

    await myDB.put(SETUP_KEY, "true");
  }
  console.log(`Server listening on port ${PORT} ....`);
});
