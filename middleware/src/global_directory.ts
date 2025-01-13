import { setupEmployees, setupInventory, setupProducts, setupSales, setupStores } from "./fragments/setup";

export const SALES = "Sales";
export const PRODUCTS = "Products";
export const INVENTORY = "Inventory";
export const EMPLOYEES = "Employees";
export const STORES = "Stores";

const relations = [SALES, PRODUCTS, INVENTORY, EMPLOYEES, STORES];

// This maps each global relation to its setup function
export const relationSetupConfig = {
    SALES: setupSales,
    PRODUCTS: setupProducts,
    INVENTORY: setupInventory,
    EMPLOYEES: setupEmployees,
    STORES: setupStores,
}