import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "freshers_contacts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"phone" varchar NOT NULL
  );
  
  CREATE TABLE "freshers_contacts_locales" (
  	"name" varchar NOT NULL,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "freshers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "freshers_contacts" ADD CONSTRAINT "freshers_contacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."freshers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "freshers_contacts_locales" ADD CONSTRAINT "freshers_contacts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."freshers_contacts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "freshers_contacts_order_idx" ON "freshers_contacts" USING btree ("_order");
  CREATE INDEX "freshers_contacts_parent_id_idx" ON "freshers_contacts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "freshers_contacts_locales_locale_parent_id_unique" ON "freshers_contacts_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "freshers_contacts" CASCADE;
  DROP TABLE "freshers_contacts_locales" CASCADE;
  DROP TABLE "freshers" CASCADE;`)
}
