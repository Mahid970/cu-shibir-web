import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_martyrs_gallery_kind" AS ENUM('life', 'day', 'after', 'place');
  CREATE TYPE "public"."enum_martyrs_rank" AS ENUM('kormi', 'sathi', 'sodossho');
  CREATE TYPE "public"."enum__martyrs_v_version_gallery_kind" AS ENUM('life', 'day', 'after', 'place');
  CREATE TYPE "public"."enum__martyrs_v_version_rank" AS ENUM('kormi', 'sathi', 'sodossho');
  CREATE TABLE "martyrs_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "martyrs_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"kind" "enum_martyrs_gallery_kind" DEFAULT 'life',
  	"graphic" boolean
  );
  
  CREATE TABLE "martyrs_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "_martyrs_v_version_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_martyrs_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"kind" "enum__martyrs_v_version_gallery_kind" DEFAULT 'life',
  	"graphic" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_martyrs_v_version_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "martyrs" ADD COLUMN "number" numeric;
  ALTER TABLE "martyrs" ADD COLUMN "rank" "enum_martyrs_rank";
  ALTER TABLE "martyrs_locales" ADD COLUMN "role" varchar;
  ALTER TABLE "martyrs_locales" ADD COLUMN "hall" varchar;
  ALTER TABLE "martyrs_locales" ADD COLUMN "home" varchar;
  ALTER TABLE "martyrs_locales" ADD COLUMN "born" varchar;
  ALTER TABLE "martyrs_locales" ADD COLUMN "family" varchar;
  ALTER TABLE "martyrs_locales" ADD COLUMN "attackers" varchar;
  ALTER TABLE "martyrs_locales" ADD COLUMN "wounds" varchar;
  ALTER TABLE "martyrs_locales" ADD COLUMN "quote" varchar;
  ALTER TABLE "martyrs_locales" ADD COLUMN "quote_by" varchar;
  ALTER TABLE "_martyrs_v" ADD COLUMN "version_number" numeric;
  ALTER TABLE "_martyrs_v" ADD COLUMN "version_rank" "enum__martyrs_v_version_rank";
  ALTER TABLE "_martyrs_v_locales" ADD COLUMN "version_role" varchar;
  ALTER TABLE "_martyrs_v_locales" ADD COLUMN "version_hall" varchar;
  ALTER TABLE "_martyrs_v_locales" ADD COLUMN "version_home" varchar;
  ALTER TABLE "_martyrs_v_locales" ADD COLUMN "version_born" varchar;
  ALTER TABLE "_martyrs_v_locales" ADD COLUMN "version_family" varchar;
  ALTER TABLE "_martyrs_v_locales" ADD COLUMN "version_attackers" varchar;
  ALTER TABLE "_martyrs_v_locales" ADD COLUMN "version_wounds" varchar;
  ALTER TABLE "_martyrs_v_locales" ADD COLUMN "version_quote" varchar;
  ALTER TABLE "_martyrs_v_locales" ADD COLUMN "version_quote_by" varchar;
  ALTER TABLE "martyrs_story" ADD CONSTRAINT "martyrs_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."martyrs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "martyrs_gallery" ADD CONSTRAINT "martyrs_gallery_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "martyrs_gallery" ADD CONSTRAINT "martyrs_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."martyrs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "martyrs_sources" ADD CONSTRAINT "martyrs_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."martyrs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_martyrs_v_version_story" ADD CONSTRAINT "_martyrs_v_version_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_martyrs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_martyrs_v_version_gallery" ADD CONSTRAINT "_martyrs_v_version_gallery_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_martyrs_v_version_gallery" ADD CONSTRAINT "_martyrs_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_martyrs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_martyrs_v_version_sources" ADD CONSTRAINT "_martyrs_v_version_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_martyrs_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "martyrs_story_order_idx" ON "martyrs_story" USING btree ("_order");
  CREATE INDEX "martyrs_story_parent_id_idx" ON "martyrs_story" USING btree ("_parent_id");
  CREATE INDEX "martyrs_story_locale_idx" ON "martyrs_story" USING btree ("_locale");
  CREATE INDEX "martyrs_gallery_order_idx" ON "martyrs_gallery" USING btree ("_order");
  CREATE INDEX "martyrs_gallery_parent_id_idx" ON "martyrs_gallery" USING btree ("_parent_id");
  CREATE INDEX "martyrs_gallery_photo_idx" ON "martyrs_gallery" USING btree ("photo_id");
  CREATE INDEX "martyrs_sources_order_idx" ON "martyrs_sources" USING btree ("_order");
  CREATE INDEX "martyrs_sources_parent_id_idx" ON "martyrs_sources" USING btree ("_parent_id");
  CREATE INDEX "_martyrs_v_version_story_order_idx" ON "_martyrs_v_version_story" USING btree ("_order");
  CREATE INDEX "_martyrs_v_version_story_parent_id_idx" ON "_martyrs_v_version_story" USING btree ("_parent_id");
  CREATE INDEX "_martyrs_v_version_story_locale_idx" ON "_martyrs_v_version_story" USING btree ("_locale");
  CREATE INDEX "_martyrs_v_version_gallery_order_idx" ON "_martyrs_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_martyrs_v_version_gallery_parent_id_idx" ON "_martyrs_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_martyrs_v_version_gallery_photo_idx" ON "_martyrs_v_version_gallery" USING btree ("photo_id");
  CREATE INDEX "_martyrs_v_version_sources_order_idx" ON "_martyrs_v_version_sources" USING btree ("_order");
  CREATE INDEX "_martyrs_v_version_sources_parent_id_idx" ON "_martyrs_v_version_sources" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "martyrs_story" CASCADE;
  DROP TABLE "martyrs_gallery" CASCADE;
  DROP TABLE "martyrs_sources" CASCADE;
  DROP TABLE "_martyrs_v_version_story" CASCADE;
  DROP TABLE "_martyrs_v_version_gallery" CASCADE;
  DROP TABLE "_martyrs_v_version_sources" CASCADE;
  ALTER TABLE "martyrs" DROP COLUMN "number";
  ALTER TABLE "martyrs" DROP COLUMN "rank";
  ALTER TABLE "martyrs_locales" DROP COLUMN "role";
  ALTER TABLE "martyrs_locales" DROP COLUMN "hall";
  ALTER TABLE "martyrs_locales" DROP COLUMN "home";
  ALTER TABLE "martyrs_locales" DROP COLUMN "born";
  ALTER TABLE "martyrs_locales" DROP COLUMN "family";
  ALTER TABLE "martyrs_locales" DROP COLUMN "attackers";
  ALTER TABLE "martyrs_locales" DROP COLUMN "wounds";
  ALTER TABLE "martyrs_locales" DROP COLUMN "quote";
  ALTER TABLE "martyrs_locales" DROP COLUMN "quote_by";
  ALTER TABLE "_martyrs_v" DROP COLUMN "version_number";
  ALTER TABLE "_martyrs_v" DROP COLUMN "version_rank";
  ALTER TABLE "_martyrs_v_locales" DROP COLUMN "version_role";
  ALTER TABLE "_martyrs_v_locales" DROP COLUMN "version_hall";
  ALTER TABLE "_martyrs_v_locales" DROP COLUMN "version_home";
  ALTER TABLE "_martyrs_v_locales" DROP COLUMN "version_born";
  ALTER TABLE "_martyrs_v_locales" DROP COLUMN "version_family";
  ALTER TABLE "_martyrs_v_locales" DROP COLUMN "version_attackers";
  ALTER TABLE "_martyrs_v_locales" DROP COLUMN "version_wounds";
  ALTER TABLE "_martyrs_v_locales" DROP COLUMN "version_quote";
  ALTER TABLE "_martyrs_v_locales" DROP COLUMN "version_quote_by";
  DROP TYPE "public"."enum_martyrs_gallery_kind";
  DROP TYPE "public"."enum_martyrs_rank";
  DROP TYPE "public"."enum__martyrs_v_version_gallery_kind";
  DROP TYPE "public"."enum__martyrs_v_version_rank";`)
}
