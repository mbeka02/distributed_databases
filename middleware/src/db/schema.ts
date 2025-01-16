import { pgTable, serial, text, real, integer, timestamp } from "drizzle-orm/pg-core";
import {EMPLOYEES, INVENTORY, PRODUCTS, SALES, STORES} from "../global_directory";

export const products = pgTable(PRODUCTS, {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    price: real("price").notNull(),
    barcode: text("barcode").notNull(),
    discount: real("discount").notNull()
});

export const stores = pgTable(STORES, {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    address: text("address").notNull()
});

export const employees = pgTable(EMPLOYEES, {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    dob: timestamp("dob").notNull(),
    work_email: text("work_email").notNull(),
    phone_number: text("phone_number").notNull(),
    sex: text("sex").notNull(),
    salary: real("salary").notNull(),
    jobTitle: text("jobTitle").notNull(),
    store_id: integer("store_id").notNull()
});

export const sales = pgTable(SALES, {
    id: serial().primaryKey(),
    product_id: integer("product_id").references(() => products.id, {onDelete: "cascade"}).notNull(),
    employee_id: integer("employee_id").references(() => employees.id, {onDelete: "cascade"}).notNull(),
    store_id: integer("store_id").references(() => stores.id, {onDelete: "cascade"}).notNull(),
    price: real("price").notNull(),
    timestamp: timestamp("timestamp").notNull()
});

export const inventory = pgTable(INVENTORY, {
    id: serial("id").primaryKey(),
    product_id: integer("product_id").references(() => products.id, {onDelete: "cascade"}).notNull(),
    store_id: integer("store_id").references(() => stores.id, {onDelete: "cascade"}).notNull(),
    item_count: integer("item_count").notNull()
})