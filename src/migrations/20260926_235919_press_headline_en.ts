import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "press_coverage" ADD COLUMN "headline_en" varchar;
  ALTER TABLE "_press_coverage_v" ADD COLUMN "version_headline_en" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "press_coverage" DROP COLUMN "headline_en";
  ALTER TABLE "_press_coverage_v" DROP COLUMN "version_headline_en";`)
}
