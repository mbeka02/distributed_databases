CREATE TABLE "Employees" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"dob" timestamp NOT NULL,
	"work_email" text NOT NULL,
	"phone_number" text NOT NULL,
	"sex" text NOT NULL,
	"salary" real NOT NULL,
	"jobTitle" text NOT NULL,
	"store_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Inventory" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"store_id" integer NOT NULL,
	"item_count" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price" real NOT NULL,
	"barcode" text NOT NULL,
	"discount" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Sales" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"employee_id" integer NOT NULL,
	"store_id" integer NOT NULL,
	"price" real NOT NULL,
	"timestamp" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Stores" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_product_id_Products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."Products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_store_id_Stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."Stores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Sales" ADD CONSTRAINT "Sales_product_id_Products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."Products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Sales" ADD CONSTRAINT "Sales_employee_id_Employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."Employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Sales" ADD CONSTRAINT "Sales_store_id_Stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."Stores"("id") ON DELETE no action ON UPDATE no action;