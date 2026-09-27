import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_blood_donors_blood_group" AS ENUM('a_pos', 'a_neg', 'b_pos', 'b_neg', 'ab_pos', 'ab_neg', 'o_pos', 'o_neg');
  CREATE TYPE "public"."enum_blood_donors_department" AS ENUM('bangla', 'english', 'history', 'philosophy', 'islamic_history_culture', 'arabic', 'islamic_studies', 'dramatics', 'persian_language_literature', 'pali', 'sanskrit', 'music', 'bangladesh_studies', 'modern_languages', 'fine_arts', 'physics', 'chemistry', 'mathematics', 'statistics', 'applied_chemistry_chemical_engineering', 'forestry_environmental_sciences', 'jnicar', 'accounting', 'management', 'finance', 'marketing', 'human_resource_management', 'banking_insurance', 'cucba', 'economics', 'political_science', 'sociology', 'public_administration', 'anthropology', 'international_relations', 'communication_journalism', 'criminology_police_science', 'development_studies', 'law', 'zoology', 'botany', 'geography_environmental_studies', 'biochemistry_molecular_biology', 'microbiology', 'soil_science', 'genetic_engineering_biotechnology', 'psychology', 'pharmacy', 'computer_science_engineering', 'electrical_electronic_engineering', 'physical_education_sports_science', 'education_research', 'marine_sciences', 'oceanography', 'fisheries', 'paediatrics', 'community_ophthalmology');
  CREATE TYPE "public"."enum_blood_donors_hall" AS ENUM('alaol', 'af_rahman', 'shahjalal', 'suhrawardy', 'shah_amanat', 'shamsun_nahar', 'shaheed_abdur_rab', 'pritilata', 'deshnetri_khaleda_zia', 'masterda_surja_sen', 'shaheed_farhad_hossain', 'bijoy_24', 'nawab_faizunnesa', 'atish_dipangkar', 'shilpi_rashid_chowdhury_hostel', 'non_resident');
  CREATE TYPE "public"."enum_blood_requests_blood_group" AS ENUM('a_pos', 'a_neg', 'b_pos', 'b_neg', 'ab_pos', 'ab_neg', 'o_pos', 'o_neg');
  CREATE TYPE "public"."enum_blood_requests_status" AS ENUM('new', 'contacting', 'fulfilled', 'closed');
  CREATE TABLE "blood_donors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"donor_id" varchar NOT NULL,
  	"blood_group" "enum_blood_donors_blood_group" NOT NULL,
  	"name" varchar NOT NULL,
  	"mobile" varchar NOT NULL,
  	"department" "enum_blood_donors_department",
  	"hall" "enum_blood_donors_hall",
  	"last_donation" timestamp(3) with time zone,
  	"available" boolean DEFAULT true,
  	"coordinator_note" varchar,
  	"consent_at" timestamp(3) with time zone,
  	"secret_hash" varchar,
  	"mobile_hash" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blood_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"blood_group" "enum_blood_requests_blood_group" NOT NULL,
  	"units" numeric DEFAULT 1 NOT NULL,
  	"hospital" varchar NOT NULL,
  	"needed_by" timestamp(3) with time zone NOT NULL,
  	"patient_note" varchar,
  	"name" varchar NOT NULL,
  	"mobile" varchar NOT NULL,
  	"status" "enum_blood_requests_status" DEFAULT 'new' NOT NULL,
  	"coordinator_note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "blood_donors_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "blood_requests_id" integer;
  CREATE UNIQUE INDEX "blood_donors_donor_id_idx" ON "blood_donors" USING btree ("donor_id");
  CREATE INDEX "blood_donors_blood_group_idx" ON "blood_donors" USING btree ("blood_group");
  CREATE INDEX "blood_donors_last_donation_idx" ON "blood_donors" USING btree ("last_donation");
  CREATE INDEX "blood_donors_available_idx" ON "blood_donors" USING btree ("available");
  CREATE INDEX "blood_donors_mobile_hash_idx" ON "blood_donors" USING btree ("mobile_hash");
  CREATE INDEX "blood_donors_updated_at_idx" ON "blood_donors" USING btree ("updated_at");
  CREATE INDEX "blood_donors_created_at_idx" ON "blood_donors" USING btree ("created_at");
  CREATE INDEX "blood_requests_blood_group_idx" ON "blood_requests" USING btree ("blood_group");
  CREATE INDEX "blood_requests_status_idx" ON "blood_requests" USING btree ("status");
  CREATE INDEX "blood_requests_updated_at_idx" ON "blood_requests" USING btree ("updated_at");
  CREATE INDEX "blood_requests_created_at_idx" ON "blood_requests" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blood_donors_fk" FOREIGN KEY ("blood_donors_id") REFERENCES "public"."blood_donors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blood_requests_fk" FOREIGN KEY ("blood_requests_id") REFERENCES "public"."blood_requests"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_blood_donors_id_idx" ON "payload_locked_documents_rels" USING btree ("blood_donors_id");
  CREATE INDEX "payload_locked_documents_rels_blood_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("blood_requests_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "blood_donors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blood_requests" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "blood_donors" CASCADE;
  DROP TABLE "blood_requests" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_blood_donors_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_blood_requests_fk";
  
  DROP INDEX "payload_locked_documents_rels_blood_donors_id_idx";
  DROP INDEX "payload_locked_documents_rels_blood_requests_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "blood_donors_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "blood_requests_id";
  DROP TYPE "public"."enum_blood_donors_blood_group";
  DROP TYPE "public"."enum_blood_donors_department";
  DROP TYPE "public"."enum_blood_donors_hall";
  DROP TYPE "public"."enum_blood_requests_blood_group";
  DROP TYPE "public"."enum_blood_requests_status";`)
}
