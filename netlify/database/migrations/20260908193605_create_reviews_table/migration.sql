CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
