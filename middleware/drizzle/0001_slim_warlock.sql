ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_product_id_Products_id_fk";
--> statement-breakpoint
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_store_id_Stores_id_fk";
--> statement-breakpoint
ALTER TABLE "Sales" DROP CONSTRAINT "Sales_product_id_Products_id_fk";
--> statement-breakpoint
ALTER TABLE "Sales" DROP CONSTRAINT "Sales_employee_id_Employees_id_fk";
--> statement-breakpoint
ALTER TABLE "Sales" DROP CONSTRAINT "Sales_store_id_Stores_id_fk";
--> statement-breakpoint
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_product_id_Products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."Products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_store_id_Stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."Stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Sales" ADD CONSTRAINT "Sales_product_id_Products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."Products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Sales" ADD CONSTRAINT "Sales_employee_id_Employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."Employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Sales" ADD CONSTRAINT "Sales_store_id_Stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."Stores"("id") ON DELETE cascade ON UPDATE no action;