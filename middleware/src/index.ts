import Express, { json, Request, Response } from "express";
import { myDB } from "./lmdb";
import { SETUP_KEY } from "./constants";
import { relationSetupConfig } from "./global_directory";
import db from "./db";
import { inventory, products } from "./db/schema";
import { count, eq } from "drizzle-orm";
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
app.get("/totalSales", async (req, res) => { });
//Warehouse staff will be incharge of performing physical inventory counts at the end of day at their store
//The supply chain team will track inventory levels across locations weekly
app.get("/trackInventory", async (req, res) => { });
//The marketing team will create item discounts weekly
//The accounts team will get employee salaries monthly
app.get("/getSalaries", async (req, res) => {
  try {
  } catch (error) { }
});

//The executive will be generating reports on sales of all locations monthly
app.get("/generateReport", async (req, res) => { });

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
