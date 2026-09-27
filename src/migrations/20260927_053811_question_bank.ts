import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_question_papers_department" AS ENUM('bangla', 'english', 'history', 'philosophy', 'islamic_history_culture', 'arabic', 'islamic_studies', 'dramatics', 'persian_language_literature', 'pali', 'sanskrit', 'music', 'bangladesh_studies', 'modern_languages', 'fine_arts', 'physics', 'chemistry', 'mathematics', 'statistics', 'applied_chemistry_chemical_engineering', 'forestry_environmental_sciences', 'jnicar', 'accounting', 'management', 'finance', 'marketing', 'human_resource_management', 'banking_insurance', 'cucba', 'economics', 'political_science', 'sociology', 'public_administration', 'anthropology', 'international_relations', 'communication_journalism', 'criminology_police_science', 'development_studies', 'law', 'zoology', 'botany', 'geography_environmental_studies', 'biochemistry_molecular_biology', 'microbiology', 'soil_science', 'genetic_engineering_biotechnology', 'psychology', 'pharmacy', 'computer_science_engineering', 'electrical_electronic_engineering', 'physical_education_sports_science', 'education_research', 'marine_sciences', 'oceanography', 'fisheries', 'paediatrics', 'community_ophthalmology');
  CREATE TYPE "public"."enum_question_papers_exam" AS ENUM('final', 'midterm', 'incourse', 'other');
  CREATE TYPE "public"."enum_question_papers_level" AS ENUM('y1', 'y2', 'y3', 'y4', 'ms');
  CREATE TYPE "public"."enum_question_papers_status" AS ENUM('pending', 'approved', 'rejected');
  CREATE TABLE "question_papers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"department" "enum_question_papers_department" NOT NULL,
  	"course_code" varchar NOT NULL,
  	"course_title" varchar,
  	"exam_year" numeric NOT NULL,
  	"exam" "enum_question_papers_exam" DEFAULT 'final' NOT NULL,
  	"level" "enum_question_papers_level",
  	"status" "enum_question_papers_status" DEFAULT 'pending' NOT NULL,
  	"moderator_note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "question_papers_id" integer;
  CREATE INDEX "question_papers_department_idx" ON "question_papers" USING btree ("department");
  CREATE INDEX "question_papers_course_code_idx" ON "question_papers" USING btree ("course_code");
  CREATE INDEX "question_papers_exam_year_idx" ON "question_papers" USING btree ("exam_year");
  CREATE INDEX "question_papers_status_idx" ON "question_papers" USING btree ("status");
  CREATE INDEX "question_papers_updated_at_idx" ON "question_papers" USING btree ("updated_at");
  CREATE INDEX "question_papers_created_at_idx" ON "question_papers" USING btree ("created_at");
  CREATE UNIQUE INDEX "question_papers_filename_idx" ON "question_papers" USING btree ("filename");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_question_papers_fk" FOREIGN KEY ("question_papers_id") REFERENCES "public"."question_papers"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_question_papers_id_idx" ON "payload_locked_documents_rels" USING btree ("question_papers_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "question_papers" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "question_papers" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_question_papers_fk";
  
  DROP INDEX "payload_locked_documents_rels_question_papers_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "question_papers_id";
  DROP TYPE "public"."enum_question_papers_department";
  DROP TYPE "public"."enum_question_papers_exam";
  DROP TYPE "public"."enum_question_papers_level";
  DROP TYPE "public"."enum_question_papers_status";`)
}
