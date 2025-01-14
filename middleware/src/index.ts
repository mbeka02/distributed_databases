import Express, { json } from "express";
import { myDB } from "./lmdb";
import { SETUP_KEY } from "./constants";
import { relationSetupConfig } from "./global_directory";
import db from "./db";
import { employees, inventory, products, sales, stores } from "./db/schema";
import { and, between, count, eq } from "drizzle-orm";

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
      return res.status(400).json({ error: "Invalid storeId parameter" });
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
    return res.status(200).json({ stock: stock || [] });
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
//Store managers will be restocking when inventory is low daily
//Store managers will be adding employee records monthly
//Store managers will be updating employee records monthly
//Store managers will be removing employee records monthly
//Cashiers will record customer purchases daily
//Cashiers will submit total sales made to store managers daily
app.get("/totalSales/:storeId", async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    if (isNaN(storeId)) {
      return res.status(400).json({ error: "Invalid storeId parameter" });
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

    return res.status(200).json({ totalSales: totalSales || [] });
  } catch (error) {
    console.error(`error checking the total sales: ${error}`);
    return res.status(500).json({ error: "Internal Server Error" });
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

    return res.status(200).json({ currentInvetory: currentInvetory || [] });
  } catch (error) {
    console.error(`error checking the inventory levels: ${error}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
//The marketing team will create item discounts weekly
//The accounts team will get employee salaries monthly
app.get("/getSalaries", async (req, res) => {
  try {
    const salaries = await db.select().from(employees);
    return res.status(200).json({ employees: employees || [] });
  } catch (error) {
    console.error(`error fetching employee salaries: ${error}`);
    return res.status(500).json({ error: "Internal Server Error" });
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
    return res.status(200).json({ reportsData: reportsData || [] });
  } catch (error) {
    console.error(`error getting the reports data: ${error}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

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
