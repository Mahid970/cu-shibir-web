import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_shuttle_trips_days" AS ENUM('sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri');
  CREATE TYPE "public"."enum_shuttle_trips_direction" AS ENUM('to-campus', 'to-city');
  CREATE TABLE "shuttle_stations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"minutes" numeric
  );
  
  CREATE TABLE "shuttle_stations_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shuttle_trips_days" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_shuttle_trips_days",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "shuttle_trips" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"direction" "enum_shuttle_trips_direction" DEFAULT 'to-campus' NOT NULL,
  	"time" varchar NOT NULL
  );
  
  CREATE TABLE "shuttle_trips_locales" (
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shuttle_closures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"from" timestamp(3) with time zone NOT NULL,
  	"to" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "shuttle_closures_locales" (
  	"reason" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shuttle" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"published" boolean DEFAULT false,
  	"effective_from" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "shuttle_locales" (
  	"source" varchar,
  	"notice" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "shuttle_stations" ADD CONSTRAINT "shuttle_stations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shuttle"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shuttle_stations_locales" ADD CONSTRAINT "shuttle_stations_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shuttle_stations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shuttle_trips_days" ADD CONSTRAINT "shuttle_trips_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."shuttle_trips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shuttle_trips" ADD CONSTRAINT "shuttle_trips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shuttle"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shuttle_trips_locales" ADD CONSTRAINT "shuttle_trips_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shuttle_trips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shuttle_closures" ADD CONSTRAINT "shuttle_closures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shuttle"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shuttle_closures_locales" ADD CONSTRAINT "shuttle_closures_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shuttle_closures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shuttle_locales" ADD CONSTRAINT "shuttle_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shuttle"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "shuttle_stations_order_idx" ON "shuttle_stations" USING btree ("_order");
  CREATE INDEX "shuttle_stations_parent_id_idx" ON "shuttle_stations" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shuttle_stations_locales_locale_parent_id_unique" ON "shuttle_stations_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shuttle_trips_days_order_idx" ON "shuttle_trips_days" USING btree ("order");
  CREATE INDEX "shuttle_trips_days_parent_idx" ON "shuttle_trips_days" USING btree ("parent_id");
  CREATE INDEX "shuttle_trips_order_idx" ON "shuttle_trips" USING btree ("_order");
  CREATE INDEX "shuttle_trips_parent_id_idx" ON "shuttle_trips" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shuttle_trips_locales_locale_parent_id_unique" ON "shuttle_trips_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shuttle_closures_order_idx" ON "shuttle_closures" USING btree ("_order");
  CREATE INDEX "shuttle_closures_parent_id_idx" ON "shuttle_closures" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shuttle_closures_locales_locale_parent_id_unique" ON "shuttle_closures_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "shuttle_locales_locale_parent_id_unique" ON "shuttle_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "shuttle_stations" CASCADE;
  DROP TABLE "shuttle_stations_locales" CASCADE;
  DROP TABLE "shuttle_trips_days" CASCADE;
  DROP TABLE "shuttle_trips" CASCADE;
  DROP TABLE "shuttle_trips_locales" CASCADE;
  DROP TABLE "shuttle_closures" CASCADE;
  DROP TABLE "shuttle_closures_locales" CASCADE;
  DROP TABLE "shuttle" CASCADE;
  DROP TABLE "shuttle_locales" CASCADE;
  DROP TYPE "public"."enum_shuttle_trips_days";
  DROP TYPE "public"."enum_shuttle_trips_direction";`)
}
