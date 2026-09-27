import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_issues_category" AS ENUM('hall', 'transport', 'food', 'safety', 'academic', 'health', 'campus', 'harassment', 'other');
  CREATE TYPE "public"."enum_issues_hall" AS ENUM('alaol', 'af_rahman', 'shahjalal', 'suhrawardy', 'shah_amanat', 'shamsun_nahar', 'shaheed_abdur_rab', 'pritilata', 'deshnetri_khaleda_zia', 'masterda_surja_sen', 'shaheed_farhad_hossain', 'bijoy_24', 'nawab_faizunnesa', 'atish_dipangkar', 'shilpi_rashid_chowdhury_hostel', 'non_resident');
  CREATE TYPE "public"."enum_issues_status" AS ENUM('received', 'reviewing', 'forwarded', 'resolved', 'closed', 'spam');
  ALTER TYPE "public"."enum_users_roles" ADD VALUE 'safety-desk' BEFORE 'scholarship-reviewer';
  CREATE TABLE "issues" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tracking_id" varchar NOT NULL,
  	"category" "enum_issues_category" NOT NULL,
  	"hall" "enum_issues_hall",
  	"subject" varchar NOT NULL,
  	"details" varchar NOT NULL,
  	"place" varchar,
  	"anonymous" boolean DEFAULT false,
  	"name" varchar,
  	"contact" varchar,
  	"status" "enum_issues_status" DEFAULT 'received' NOT NULL,
  	"public_note" varchar,
  	"staff_note" varchar,
  	"resolved_at" timestamp(3) with time zone,
  	"status_history" jsonb,
  	"secret_hash" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "issues_id" integer;
  CREATE UNIQUE INDEX "issues_tracking_id_idx" ON "issues" USING btree ("tracking_id");
  CREATE INDEX "issues_category_idx" ON "issues" USING btree ("category");
  CREATE INDEX "issues_status_idx" ON "issues" USING btree ("status");
  CREATE INDEX "issues_resolved_at_idx" ON "issues" USING btree ("resolved_at");
  CREATE INDEX "issues_updated_at_idx" ON "issues" USING btree ("updated_at");
  CREATE INDEX "issues_created_at_idx" ON "issues" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_issues_fk" FOREIGN KEY ("issues_id") REFERENCES "public"."issues"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_issues_id_idx" ON "payload_locked_documents_rels" USING btree ("issues_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "issues" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "issues" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_issues_fk";
  
  ALTER TABLE "users_roles" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_users_roles";
  CREATE TYPE "public"."enum_users_roles" AS ENUM('super-admin', 'admin', 'editor', 'contributor', 'service-desk', 'scholarship-reviewer', 'blood-coordinator', 'event-manager', 'volunteer');
  ALTER TABLE "users_roles" ALTER COLUMN "value" SET DATA TYPE "public"."enum_users_roles" USING "value"::"public"."enum_users_roles";
  DROP INDEX "payload_locked_documents_rels_issues_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "issues_id";
  DROP TYPE "public"."enum_issues_category";
  DROP TYPE "public"."enum_issues_hall";
  DROP TYPE "public"."enum_issues_status";`)
}
