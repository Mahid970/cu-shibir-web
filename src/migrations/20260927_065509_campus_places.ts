import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_campus_places_category" AS ENUM('faculty', 'hall', 'study', 'health', 'mosque', 'transport', 'office', 'open');
  CREATE TABLE "campus_places" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"category" "enum_campus_places_category" NOT NULL,
  	"lat" numeric NOT NULL,
  	"lng" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "campus_places_locales" (
  	"name" varchar NOT NULL,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "campus_places_id" integer;
  ALTER TABLE "campus_places_locales" ADD CONSTRAINT "campus_places_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."campus_places"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "campus_places_key_idx" ON "campus_places" USING btree ("key");
  CREATE INDEX "campus_places_category_idx" ON "campus_places" USING btree ("category");
  CREATE INDEX "campus_places_updated_at_idx" ON "campus_places" USING btree ("updated_at");
  CREATE INDEX "campus_places_created_at_idx" ON "campus_places" USING btree ("created_at");
  CREATE UNIQUE INDEX "campus_places_locales_locale_parent_id_unique" ON "campus_places_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_campus_places_fk" FOREIGN KEY ("campus_places_id") REFERENCES "public"."campus_places"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_campus_places_id_idx" ON "payload_locked_documents_rels" USING btree ("campus_places_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "campus_places" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "campus_places_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "campus_places" CASCADE;
  DROP TABLE "campus_places_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_campus_places_fk";
  
  DROP INDEX "payload_locked_documents_rels_campus_places_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "campus_places_id";
  DROP TYPE "public"."enum_campus_places_category";`)
}
