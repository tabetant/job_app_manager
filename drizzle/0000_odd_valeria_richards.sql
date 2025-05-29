CREATE TYPE "public"."status" AS ENUM('applied', 'interview', 'offer', 'rejected');--> statement-breakpoint
CREATE TABLE "applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_title" varchar(255) NOT NULL,
	"company" varchar(255) NOT NULL,
	"date_applied" date DEFAULT now(),
	"status" "status" NOT NULL,
	"notes" text
);
