import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_martyrs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__martyrs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__martyrs_v_published_locale" AS ENUM('bn', 'en');
  CREATE TABLE "martyrs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone,
  	"order" numeric DEFAULT 100,
  	"photo_id" integer,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_martyrs_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "martyrs_locales" (
  	"name" varchar,
  	"date_text" varchar,
  	"affiliation" varchar,
  	"place" varchar,
  	"summary" varchar,
  	"bio" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_martyrs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_date" timestamp(3) with time zone,
  	"version_order" numeric DEFAULT 100,
  	"version_photo_id" integer,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__martyrs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__martyrs_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_martyrs_v_locales" (
  	"version_name" varchar,
  	"version_date_text" varchar,
  	"version_affiliation" varchar,
  	"version_place" varchar,
  	"version_summary" varchar,
  	"version_bio" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "martyrs_id" integer;
  ALTER TABLE "martyrs" ADD CONSTRAINT "martyrs_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "martyrs_locales" ADD CONSTRAINT "martyrs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."martyrs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_martyrs_v" ADD CONSTRAINT "_martyrs_v_parent_id_martyrs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."martyrs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_martyrs_v" ADD CONSTRAINT "_martyrs_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_martyrs_v_locales" ADD CONSTRAINT "_martyrs_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_martyrs_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "martyrs_photo_idx" ON "martyrs" USING btree ("photo_id");
  CREATE UNIQUE INDEX "martyrs_slug_idx" ON "martyrs" USING btree ("slug");
  CREATE INDEX "martyrs_updated_at_idx" ON "martyrs" USING btree ("updated_at");
  CREATE INDEX "martyrs_created_at_idx" ON "martyrs" USING btree ("created_at");
  CREATE INDEX "martyrs__status_idx" ON "martyrs" USING btree ("_status");
  CREATE UNIQUE INDEX "martyrs_locales_locale_parent_id_unique" ON "martyrs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_martyrs_v_parent_idx" ON "_martyrs_v" USING btree ("parent_id");
  CREATE INDEX "_martyrs_v_version_version_photo_idx" ON "_martyrs_v" USING btree ("version_photo_id");
  CREATE INDEX "_martyrs_v_version_version_slug_idx" ON "_martyrs_v" USING btree ("version_slug");
  CREATE INDEX "_martyrs_v_version_version_updated_at_idx" ON "_martyrs_v" USING btree ("version_updated_at");
  CREATE INDEX "_martyrs_v_version_version_created_at_idx" ON "_martyrs_v" USING btree ("version_created_at");
  CREATE INDEX "_martyrs_v_version_version__status_idx" ON "_martyrs_v" USING btree ("version__status");
  CREATE INDEX "_martyrs_v_created_at_idx" ON "_martyrs_v" USING btree ("created_at");
  CREATE INDEX "_martyrs_v_updated_at_idx" ON "_martyrs_v" USING btree ("updated_at");
  CREATE INDEX "_martyrs_v_snapshot_idx" ON "_martyrs_v" USING btree ("snapshot");
  CREATE INDEX "_martyrs_v_published_locale_idx" ON "_martyrs_v" USING btree ("published_locale");
  CREATE INDEX "_martyrs_v_latest_idx" ON "_martyrs_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_martyrs_v_locales_locale_parent_id_unique" ON "_martyrs_v_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_martyrs_fk" FOREIGN KEY ("martyrs_id") REFERENCES "public"."martyrs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_martyrs_id_idx" ON "payload_locked_documents_rels" USING btree ("martyrs_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "martyrs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "martyrs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_martyrs_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_martyrs_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "martyrs" CASCADE;
  DROP TABLE "martyrs_locales" CASCADE;
  DROP TABLE "_martyrs_v" CASCADE;
  DROP TABLE "_martyrs_v_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_martyrs_fk";
  
  DROP INDEX "payload_locked_documents_rels_martyrs_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "martyrs_id";
  DROP TYPE "public"."enum_martyrs_status";
  DROP TYPE "public"."enum__martyrs_v_version_status";
  DROP TYPE "public"."enum__martyrs_v_published_locale";`)
}
