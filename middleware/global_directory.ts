import { setupEmployees, setupInventory, setupProducts, setupSales, setupStores } from "./fragments/setup";

const SALES = "Sales";
const PRODUCTS = "Products";
const INVENTORY = "Inventory";
const EMPLOYEES = "Employees";
const STORES = "Stores";

const relations = [SALES, PRODUCTS, INVENTORY, EMPLOYEES, STORES];

// This maps each global relation to its setup function
export const relationSetupConfig = {
    SALES: setupSales,
    PRODUCTS: setupProducts,
    INVENTORY: setupInventory,
    EMPLOYEES: setupEmployees,
    STORES: setupStores,
}