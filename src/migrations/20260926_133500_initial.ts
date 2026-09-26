import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('bn', 'en');
  CREATE TYPE "public"."enum_posts_category" AS ENUM('news', 'statement', 'press-conference', 'article', 'book-review', 'organisation', 'welfare', 'education');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_category" AS ENUM('news', 'statement', 'press-conference', 'article', 'book-review', 'organisation', 'welfare', 'education');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('bn', 'en');
  CREATE TYPE "public"."enum_people_group" AS ENUM('executive', 'sub-branch', 'former');
  CREATE TYPE "public"."enum_people_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__people_v_version_group" AS ENUM('executive', 'sub-branch', 'former');
  CREATE TYPE "public"."enum__people_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__people_v_published_locale" AS ENUM('bn', 'en');
  CREATE TYPE "public"."enum_press_coverage_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__press_coverage_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__press_coverage_v_published_locale" AS ENUM('bn', 'en');
  CREATE TYPE "public"."enum_videos_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__videos_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__videos_v_published_locale" AS ENUM('bn', 'en');
  CREATE TYPE "public"."enum_albums_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__albums_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__albums_v_published_locale" AS ENUM('bn', 'en');
  CREATE TYPE "public"."enum_supporters_interests" AS ENUM('dawah', 'study', 'welfare', 'writing', 'media', 'it', 'culture', 'sports');
  CREATE TYPE "public"."enum_supporters_department" AS ENUM('bangla', 'english', 'history', 'philosophy', 'islamic_history_culture', 'arabic', 'islamic_studies', 'dramatics', 'persian_language_literature', 'pali', 'sanskrit', 'music', 'bangladesh_studies', 'modern_languages', 'fine_arts', 'physics', 'chemistry', 'mathematics', 'statistics', 'applied_chemistry_chemical_engineering', 'forestry_environmental_sciences', 'jnicar', 'accounting', 'management', 'finance', 'marketing', 'human_resource_management', 'banking_insurance', 'cucba', 'economics', 'political_science', 'sociology', 'public_administration', 'anthropology', 'international_relations', 'communication_journalism', 'criminology_police_science', 'development_studies', 'law', 'zoology', 'botany', 'geography_environmental_studies', 'biochemistry_molecular_biology', 'microbiology', 'soil_science', 'genetic_engineering_biotechnology', 'psychology', 'pharmacy', 'computer_science_engineering', 'electrical_electronic_engineering', 'physical_education_sports_science', 'education_research', 'marine_sciences', 'oceanography', 'fisheries', 'paediatrics', 'community_ophthalmology');
  CREATE TYPE "public"."enum_supporters_hall" AS ENUM('alaol', 'af_rahman', 'shahjalal', 'suhrawardy', 'shah_amanat', 'shamsun_nahar', 'shaheed_abdur_rab', 'pritilata', 'deshnetri_khaleda_zia', 'masterda_surja_sen', 'shaheed_farhad_hossain', 'bijoy_24', 'nawab_faizunnesa', 'atish_dipangkar', 'shilpi_rashid_chowdhury_hostel', 'non_resident');
  CREATE TYPE "public"."enum_supporters_status" AS ENUM('new', 'contacted', 'active', 'closed');
  CREATE TYPE "public"."enum_feedback_kind" AS ENUM('advice', 'ehtesab', 'complaint');
  CREATE TYPE "public"."enum_feedback_status" AS ENUM('new', 'in-review', 'answered', 'closed');
  CREATE TYPE "public"."enum_assistance_type" AS ENUM('scholarship', 'medical', 'other');
  CREATE TYPE "public"."enum_assistance_department" AS ENUM('bangla', 'english', 'history', 'philosophy', 'islamic_history_culture', 'arabic', 'islamic_studies', 'dramatics', 'persian_language_literature', 'pali', 'sanskrit', 'music', 'bangladesh_studies', 'modern_languages', 'fine_arts', 'physics', 'chemistry', 'mathematics', 'statistics', 'applied_chemistry_chemical_engineering', 'forestry_environmental_sciences', 'jnicar', 'accounting', 'management', 'finance', 'marketing', 'human_resource_management', 'banking_insurance', 'cucba', 'economics', 'political_science', 'sociology', 'public_administration', 'anthropology', 'international_relations', 'communication_journalism', 'criminology_police_science', 'development_studies', 'law', 'zoology', 'botany', 'geography_environmental_studies', 'biochemistry_molecular_biology', 'microbiology', 'soil_science', 'genetic_engineering_biotechnology', 'psychology', 'pharmacy', 'computer_science_engineering', 'electrical_electronic_engineering', 'physical_education_sports_science', 'education_research', 'marine_sciences', 'oceanography', 'fisheries', 'paediatrics', 'community_ophthalmology');
  CREATE TYPE "public"."enum_assistance_hall" AS ENUM('alaol', 'af_rahman', 'shahjalal', 'suhrawardy', 'shah_amanat', 'shamsun_nahar', 'shaheed_abdur_rab', 'pritilata', 'deshnetri_khaleda_zia', 'masterda_surja_sen', 'shaheed_farhad_hossain', 'bijoy_24', 'nawab_faizunnesa', 'atish_dipangkar', 'shilpi_rashid_chowdhury_hostel', 'non_resident');
  CREATE TYPE "public"."enum_assistance_status" AS ENUM('submitted', 'review', 'interview', 'approved', 'declined');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('super-admin', 'admin', 'editor', 'contributor', 'service-desk', 'scholarship-reviewer', 'blood-coordinator', 'event-manager', 'volunteer');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'generateShareImage', 'purgeSubmissions', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'generateShareImage', 'purgeSubmissions', 'schedulePublish');
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"category" "enum_posts_category" DEFAULT 'news',
  	"published_at" timestamp(3) with time zone,
  	"hero_image_id" integer,
  	"featured" boolean,
  	"share_image_id" integer,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"legacy_id" numeric,
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"content" jsonb,
  	"byline_name" varchar,
  	"byline_affiliation" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"search_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_category" "enum__posts_v_version_category" DEFAULT 'news',
  	"version_published_at" timestamp(3) with time zone,
  	"version_hero_image_id" integer,
  	"version_featured" boolean,
  	"version_share_image_id" integer,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_legacy_id" numeric,
  	"version_seo_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__posts_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_posts_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_byline_name" varchar,
  	"version_byline_affiliation" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_search_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "people" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"group" "enum_people_group" DEFAULT 'executive',
  	"term" varchar DEFAULT '২০২৬',
  	"order" numeric DEFAULT 100,
  	"photo_id" integer,
  	"session" varchar,
  	"email" varchar,
  	"socials_facebook" varchar,
  	"socials_instagram" varchar,
  	"socials_x" varchar,
  	"socials_youtube" varchar,
  	"socials_telegram" varchar,
  	"profile_completeness" numeric,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"legacy_id" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_people_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "people_locales" (
  	"name" varchar,
  	"position" varchar,
  	"department" varchar,
  	"hall" varchar,
  	"bio" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_people_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_group" "enum__people_v_version_group" DEFAULT 'executive',
  	"version_term" varchar DEFAULT '২০২৬',
  	"version_order" numeric DEFAULT 100,
  	"version_photo_id" integer,
  	"version_session" varchar,
  	"version_email" varchar,
  	"version_socials_facebook" varchar,
  	"version_socials_instagram" varchar,
  	"version_socials_x" varchar,
  	"version_socials_youtube" varchar,
  	"version_socials_telegram" varchar,
  	"version_profile_completeness" numeric,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_legacy_id" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__people_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__people_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_people_v_locales" (
  	"version_name" varchar,
  	"version_position" varchar,
  	"version_department" varchar,
  	"version_hall" varchar,
  	"version_bio" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "press_coverage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"outlet" varchar,
  	"published_at" timestamp(3) with time zone,
  	"url" varchar,
  	"external_image_url" varchar,
  	"legacy_id" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_press_coverage_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_press_coverage_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_headline" varchar,
  	"version_outlet" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_url" varchar,
  	"version_external_image_url" varchar,
  	"version_legacy_id" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__press_coverage_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__press_coverage_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "videos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"youtube_id" varchar,
  	"published_at" timestamp(3) with time zone,
  	"featured" boolean,
  	"legacy_id" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_videos_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "videos_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_videos_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_youtube_id" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_featured" boolean,
  	"version_legacy_id" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__videos_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__videos_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_videos_v_locales" (
  	"version_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "albums" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone,
  	"legacy_ids" jsonb,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_albums_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "albums_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "albums_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_albums_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_date" timestamp(3) with time zone,
  	"version_legacy_ids" jsonb,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__albums_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__albums_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_albums_v_locales" (
  	"version_title" varchar,
  	"version_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_albums_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"credit" varchar,
  	"source_url" varchar,
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
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "supporters_interests" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_supporters_interests",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "supporters" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"mobile" varchar NOT NULL,
  	"email" varchar,
  	"facebook" varchar,
  	"department" "enum_supporters_department" NOT NULL,
  	"session" varchar NOT NULL,
  	"hall" "enum_supporters_hall",
  	"note" varchar,
  	"status" "enum_supporters_status" DEFAULT 'new' NOT NULL,
  	"staff_note" varchar,
  	"consent_at" timestamp(3) with time zone,
  	"mobile_hash" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "feedback" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum_feedback_kind" NOT NULL,
  	"about_id" integer,
  	"subject" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"anonymous" boolean,
  	"name" varchar,
  	"contact" varchar,
  	"status" "enum_feedback_status" DEFAULT 'new' NOT NULL,
  	"staff_note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "assistance" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tracking_id" varchar NOT NULL,
  	"type" "enum_assistance_type" NOT NULL,
  	"subject" varchar,
  	"name" varchar NOT NULL,
  	"mobile" varchar NOT NULL,
  	"registration" varchar,
  	"department" "enum_assistance_department" NOT NULL,
  	"session" varchar NOT NULL,
  	"hall" "enum_assistance_hall",
  	"details" varchar NOT NULL,
  	"references" varchar,
  	"status" "enum_assistance_status" DEFAULT 'submitted' NOT NULL,
  	"public_note" varchar,
  	"staff_note" varchar,
  	"status_history" jsonb,
  	"secret_hash" varchar,
  	"mobile_hash" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"meta" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"people_id" integer,
  	"press_coverage_id" integer,
  	"videos_id" integer,
  	"albums_id" integer,
  	"media_id" integer,
  	"supporters_id" integer,
  	"feedback_id" integer,
  	"assistance_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric NOT NULL,
  	"suffix" varchar
  );
  
  CREATE TABLE "site_settings_stats_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"contact_email" varchar DEFAULT 'cuchhatrashibir@gmail.com',
  	"socials_facebook" varchar DEFAULT 'https://www.facebook.com/cushibir',
  	"socials_x" varchar DEFAULT 'https://x.com/CUshibir77',
  	"socials_instagram" varchar DEFAULT 'https://www.instagram.com/cuchhatrashibir/',
  	"socials_youtube" varchar DEFAULT 'https://www.youtube.com/@CuShibir777',
  	"socials_telegram" varchar DEFAULT 'https://t.me/cushibir',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"tagline" varchar DEFAULT 'আমরা তরুণ, আমরাই পারি',
  	"hero_intro" varchar DEFAULT 'সৎ, দক্ষ ও দেশপ্রেমিক নাগরিক গড়ার লক্ষ্যে চট্টগ্রাম বিশ্ববিদ্যালয়ের শিক্ষার্থীদের পাশে — ক্লাসে, হলে, শাটলে, আন্দোলনে।',
  	"contact_address" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "payload_jobs_stats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"stats" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "posts" ADD CONSTRAINT "posts_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_share_image_id_media_id_fk" FOREIGN KEY ("share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_share_image_id_media_id_fk" FOREIGN KEY ("version_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "people" ADD CONSTRAINT "people_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "people_locales" ADD CONSTRAINT "people_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_people_v" ADD CONSTRAINT "_people_v_parent_id_people_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_people_v" ADD CONSTRAINT "_people_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_people_v_locales" ADD CONSTRAINT "_people_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_people_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_press_coverage_v" ADD CONSTRAINT "_press_coverage_v_parent_id_press_coverage_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."press_coverage"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "videos_locales" ADD CONSTRAINT "videos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_videos_v" ADD CONSTRAINT "_videos_v_parent_id_videos_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_videos_v_locales" ADD CONSTRAINT "_videos_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_videos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "albums_locales" ADD CONSTRAINT "albums_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "albums_rels" ADD CONSTRAINT "albums_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "albums_rels" ADD CONSTRAINT "albums_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_albums_v" ADD CONSTRAINT "_albums_v_parent_id_albums_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."albums"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_albums_v_locales" ADD CONSTRAINT "_albums_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_albums_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_albums_v_rels" ADD CONSTRAINT "_albums_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_albums_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_albums_v_rels" ADD CONSTRAINT "_albums_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "supporters_interests" ADD CONSTRAINT "supporters_interests_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."supporters"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "feedback" ADD CONSTRAINT "feedback_about_id_people_id_fk" FOREIGN KEY ("about_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_press_coverage_fk" FOREIGN KEY ("press_coverage_id") REFERENCES "public"."press_coverage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_videos_fk" FOREIGN KEY ("videos_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_albums_fk" FOREIGN KEY ("albums_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_supporters_fk" FOREIGN KEY ("supporters_id") REFERENCES "public"."supporters"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_feedback_fk" FOREIGN KEY ("feedback_id") REFERENCES "public"."feedback"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_assistance_fk" FOREIGN KEY ("assistance_id") REFERENCES "public"."assistance"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_stats" ADD CONSTRAINT "site_settings_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_stats_locales" ADD CONSTRAINT "site_settings_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_hero_image_idx" ON "posts" USING btree ("hero_image_id");
  CREATE INDEX "posts_share_image_idx" ON "posts" USING btree ("share_image_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_legacy_id_idx" ON "posts" USING btree ("legacy_id");
  CREATE INDEX "posts_seo_seo_image_idx" ON "posts" USING btree ("seo_image_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_hero_image_idx" ON "_posts_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_posts_v_version_version_share_image_idx" ON "_posts_v" USING btree ("version_share_image_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_legacy_id_idx" ON "_posts_v" USING btree ("version_legacy_id");
  CREATE INDEX "_posts_v_version_seo_version_seo_image_idx" ON "_posts_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_snapshot_idx" ON "_posts_v" USING btree ("snapshot");
  CREATE INDEX "_posts_v_published_locale_idx" ON "_posts_v" USING btree ("published_locale");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_posts_v_locales_locale_parent_id_unique" ON "_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "people_photo_idx" ON "people" USING btree ("photo_id");
  CREATE UNIQUE INDEX "people_slug_idx" ON "people" USING btree ("slug");
  CREATE INDEX "people_legacy_id_idx" ON "people" USING btree ("legacy_id");
  CREATE INDEX "people_updated_at_idx" ON "people" USING btree ("updated_at");
  CREATE INDEX "people_created_at_idx" ON "people" USING btree ("created_at");
  CREATE INDEX "people__status_idx" ON "people" USING btree ("_status");
  CREATE UNIQUE INDEX "people_locales_locale_parent_id_unique" ON "people_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_people_v_parent_idx" ON "_people_v" USING btree ("parent_id");
  CREATE INDEX "_people_v_version_version_photo_idx" ON "_people_v" USING btree ("version_photo_id");
  CREATE INDEX "_people_v_version_version_slug_idx" ON "_people_v" USING btree ("version_slug");
  CREATE INDEX "_people_v_version_version_legacy_id_idx" ON "_people_v" USING btree ("version_legacy_id");
  CREATE INDEX "_people_v_version_version_updated_at_idx" ON "_people_v" USING btree ("version_updated_at");
  CREATE INDEX "_people_v_version_version_created_at_idx" ON "_people_v" USING btree ("version_created_at");
  CREATE INDEX "_people_v_version_version__status_idx" ON "_people_v" USING btree ("version__status");
  CREATE INDEX "_people_v_created_at_idx" ON "_people_v" USING btree ("created_at");
  CREATE INDEX "_people_v_updated_at_idx" ON "_people_v" USING btree ("updated_at");
  CREATE INDEX "_people_v_snapshot_idx" ON "_people_v" USING btree ("snapshot");
  CREATE INDEX "_people_v_published_locale_idx" ON "_people_v" USING btree ("published_locale");
  CREATE INDEX "_people_v_latest_idx" ON "_people_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_people_v_locales_locale_parent_id_unique" ON "_people_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "press_coverage_legacy_id_idx" ON "press_coverage" USING btree ("legacy_id");
  CREATE INDEX "press_coverage_updated_at_idx" ON "press_coverage" USING btree ("updated_at");
  CREATE INDEX "press_coverage_created_at_idx" ON "press_coverage" USING btree ("created_at");
  CREATE INDEX "press_coverage__status_idx" ON "press_coverage" USING btree ("_status");
  CREATE INDEX "_press_coverage_v_parent_idx" ON "_press_coverage_v" USING btree ("parent_id");
  CREATE INDEX "_press_coverage_v_version_version_legacy_id_idx" ON "_press_coverage_v" USING btree ("version_legacy_id");
  CREATE INDEX "_press_coverage_v_version_version_updated_at_idx" ON "_press_coverage_v" USING btree ("version_updated_at");
  CREATE INDEX "_press_coverage_v_version_version_created_at_idx" ON "_press_coverage_v" USING btree ("version_created_at");
  CREATE INDEX "_press_coverage_v_version_version__status_idx" ON "_press_coverage_v" USING btree ("version__status");
  CREATE INDEX "_press_coverage_v_created_at_idx" ON "_press_coverage_v" USING btree ("created_at");
  CREATE INDEX "_press_coverage_v_updated_at_idx" ON "_press_coverage_v" USING btree ("updated_at");
  CREATE INDEX "_press_coverage_v_snapshot_idx" ON "_press_coverage_v" USING btree ("snapshot");
  CREATE INDEX "_press_coverage_v_published_locale_idx" ON "_press_coverage_v" USING btree ("published_locale");
  CREATE INDEX "_press_coverage_v_latest_idx" ON "_press_coverage_v" USING btree ("latest");
  CREATE INDEX "videos_legacy_id_idx" ON "videos" USING btree ("legacy_id");
  CREATE INDEX "videos_updated_at_idx" ON "videos" USING btree ("updated_at");
  CREATE INDEX "videos_created_at_idx" ON "videos" USING btree ("created_at");
  CREATE INDEX "videos__status_idx" ON "videos" USING btree ("_status");
  CREATE UNIQUE INDEX "videos_locales_locale_parent_id_unique" ON "videos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_videos_v_parent_idx" ON "_videos_v" USING btree ("parent_id");
  CREATE INDEX "_videos_v_version_version_legacy_id_idx" ON "_videos_v" USING btree ("version_legacy_id");
  CREATE INDEX "_videos_v_version_version_updated_at_idx" ON "_videos_v" USING btree ("version_updated_at");
  CREATE INDEX "_videos_v_version_version_created_at_idx" ON "_videos_v" USING btree ("version_created_at");
  CREATE INDEX "_videos_v_version_version__status_idx" ON "_videos_v" USING btree ("version__status");
  CREATE INDEX "_videos_v_created_at_idx" ON "_videos_v" USING btree ("created_at");
  CREATE INDEX "_videos_v_updated_at_idx" ON "_videos_v" USING btree ("updated_at");
  CREATE INDEX "_videos_v_snapshot_idx" ON "_videos_v" USING btree ("snapshot");
  CREATE INDEX "_videos_v_published_locale_idx" ON "_videos_v" USING btree ("published_locale");
  CREATE INDEX "_videos_v_latest_idx" ON "_videos_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_videos_v_locales_locale_parent_id_unique" ON "_videos_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "albums_slug_idx" ON "albums" USING btree ("slug");
  CREATE INDEX "albums_updated_at_idx" ON "albums" USING btree ("updated_at");
  CREATE INDEX "albums_created_at_idx" ON "albums" USING btree ("created_at");
  CREATE INDEX "albums__status_idx" ON "albums" USING btree ("_status");
  CREATE UNIQUE INDEX "albums_locales_locale_parent_id_unique" ON "albums_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "albums_rels_order_idx" ON "albums_rels" USING btree ("order");
  CREATE INDEX "albums_rels_parent_idx" ON "albums_rels" USING btree ("parent_id");
  CREATE INDEX "albums_rels_path_idx" ON "albums_rels" USING btree ("path");
  CREATE INDEX "albums_rels_media_id_idx" ON "albums_rels" USING btree ("media_id");
  CREATE INDEX "_albums_v_parent_idx" ON "_albums_v" USING btree ("parent_id");
  CREATE INDEX "_albums_v_version_version_slug_idx" ON "_albums_v" USING btree ("version_slug");
  CREATE INDEX "_albums_v_version_version_updated_at_idx" ON "_albums_v" USING btree ("version_updated_at");
  CREATE INDEX "_albums_v_version_version_created_at_idx" ON "_albums_v" USING btree ("version_created_at");
  CREATE INDEX "_albums_v_version_version__status_idx" ON "_albums_v" USING btree ("version__status");
  CREATE INDEX "_albums_v_created_at_idx" ON "_albums_v" USING btree ("created_at");
  CREATE INDEX "_albums_v_updated_at_idx" ON "_albums_v" USING btree ("updated_at");
  CREATE INDEX "_albums_v_snapshot_idx" ON "_albums_v" USING btree ("snapshot");
  CREATE INDEX "_albums_v_published_locale_idx" ON "_albums_v" USING btree ("published_locale");
  CREATE INDEX "_albums_v_latest_idx" ON "_albums_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_albums_v_locales_locale_parent_id_unique" ON "_albums_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_albums_v_rels_order_idx" ON "_albums_v_rels" USING btree ("order");
  CREATE INDEX "_albums_v_rels_parent_idx" ON "_albums_v_rels" USING btree ("parent_id");
  CREATE INDEX "_albums_v_rels_path_idx" ON "_albums_v_rels" USING btree ("path");
  CREATE INDEX "_albums_v_rels_media_id_idx" ON "_albums_v_rels" USING btree ("media_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "supporters_interests_order_idx" ON "supporters_interests" USING btree ("order");
  CREATE INDEX "supporters_interests_parent_idx" ON "supporters_interests" USING btree ("parent_id");
  CREATE INDEX "supporters_status_idx" ON "supporters" USING btree ("status");
  CREATE INDEX "supporters_mobile_hash_idx" ON "supporters" USING btree ("mobile_hash");
  CREATE INDEX "supporters_updated_at_idx" ON "supporters" USING btree ("updated_at");
  CREATE INDEX "supporters_created_at_idx" ON "supporters" USING btree ("created_at");
  CREATE INDEX "feedback_about_idx" ON "feedback" USING btree ("about_id");
  CREATE INDEX "feedback_status_idx" ON "feedback" USING btree ("status");
  CREATE INDEX "feedback_updated_at_idx" ON "feedback" USING btree ("updated_at");
  CREATE INDEX "feedback_created_at_idx" ON "feedback" USING btree ("created_at");
  CREATE UNIQUE INDEX "assistance_tracking_id_idx" ON "assistance" USING btree ("tracking_id");
  CREATE INDEX "assistance_status_idx" ON "assistance" USING btree ("status");
  CREATE INDEX "assistance_mobile_hash_idx" ON "assistance" USING btree ("mobile_hash");
  CREATE INDEX "assistance_updated_at_idx" ON "assistance" USING btree ("updated_at");
  CREATE INDEX "assistance_created_at_idx" ON "assistance" USING btree ("created_at");
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_people_id_idx" ON "payload_locked_documents_rels" USING btree ("people_id");
  CREATE INDEX "payload_locked_documents_rels_press_coverage_id_idx" ON "payload_locked_documents_rels" USING btree ("press_coverage_id");
  CREATE INDEX "payload_locked_documents_rels_videos_id_idx" ON "payload_locked_documents_rels" USING btree ("videos_id");
  CREATE INDEX "payload_locked_documents_rels_albums_id_idx" ON "payload_locked_documents_rels" USING btree ("albums_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_supporters_id_idx" ON "payload_locked_documents_rels" USING btree ("supporters_id");
  CREATE INDEX "payload_locked_documents_rels_feedback_id_idx" ON "payload_locked_documents_rels" USING btree ("feedback_id");
  CREATE INDEX "payload_locked_documents_rels_assistance_id_idx" ON "payload_locked_documents_rels" USING btree ("assistance_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_stats_order_idx" ON "site_settings_stats" USING btree ("_order");
  CREATE INDEX "site_settings_stats_parent_id_idx" ON "site_settings_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_stats_locales_locale_parent_id_unique" ON "site_settings_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_hero_image_idx" ON "site_settings" USING btree ("hero_image_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_rels_order_idx" ON "site_settings_rels" USING btree ("order");
  CREATE INDEX "site_settings_rels_parent_idx" ON "site_settings_rels" USING btree ("parent_id");
  CREATE INDEX "site_settings_rels_path_idx" ON "site_settings_rels" USING btree ("path");
  CREATE INDEX "site_settings_rels_media_id_idx" ON "site_settings_rels" USING btree ("media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_locales" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_locales" CASCADE;
  DROP TABLE "people" CASCADE;
  DROP TABLE "people_locales" CASCADE;
  DROP TABLE "_people_v" CASCADE;
  DROP TABLE "_people_v_locales" CASCADE;
  DROP TABLE "press_coverage" CASCADE;
  DROP TABLE "_press_coverage_v" CASCADE;
  DROP TABLE "videos" CASCADE;
  DROP TABLE "videos_locales" CASCADE;
  DROP TABLE "_videos_v" CASCADE;
  DROP TABLE "_videos_v_locales" CASCADE;
  DROP TABLE "albums" CASCADE;
  DROP TABLE "albums_locales" CASCADE;
  DROP TABLE "albums_rels" CASCADE;
  DROP TABLE "_albums_v" CASCADE;
  DROP TABLE "_albums_v_locales" CASCADE;
  DROP TABLE "_albums_v_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "supporters_interests" CASCADE;
  DROP TABLE "supporters" CASCADE;
  DROP TABLE "feedback" CASCADE;
  DROP TABLE "assistance" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_stats" CASCADE;
  DROP TABLE "site_settings_stats_locales" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "site_settings_rels" CASCADE;
  DROP TABLE "payload_jobs_stats" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_posts_category";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_category";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum__posts_v_published_locale";
  DROP TYPE "public"."enum_people_group";
  DROP TYPE "public"."enum_people_status";
  DROP TYPE "public"."enum__people_v_version_group";
  DROP TYPE "public"."enum__people_v_version_status";
  DROP TYPE "public"."enum__people_v_published_locale";
  DROP TYPE "public"."enum_press_coverage_status";
  DROP TYPE "public"."enum__press_coverage_v_version_status";
  DROP TYPE "public"."enum__press_coverage_v_published_locale";
  DROP TYPE "public"."enum_videos_status";
  DROP TYPE "public"."enum__videos_v_version_status";
  DROP TYPE "public"."enum__videos_v_published_locale";
  DROP TYPE "public"."enum_albums_status";
  DROP TYPE "public"."enum__albums_v_version_status";
  DROP TYPE "public"."enum__albums_v_published_locale";
  DROP TYPE "public"."enum_supporters_interests";
  DROP TYPE "public"."enum_supporters_department";
  DROP TYPE "public"."enum_supporters_hall";
  DROP TYPE "public"."enum_supporters_status";
  DROP TYPE "public"."enum_feedback_kind";
  DROP TYPE "public"."enum_feedback_status";
  DROP TYPE "public"."enum_assistance_type";
  DROP TYPE "public"."enum_assistance_department";
  DROP TYPE "public"."enum_assistance_hall";
  DROP TYPE "public"."enum_assistance_status";
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
