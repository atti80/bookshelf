CREATE TYPE "public"."notificationType" AS ENUM('draft', 'published', 'deleted');--> statement-breakpoint
CREATE TABLE "articleTable" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"authorId" integer NOT NULL,
	"status" "notificationType" DEFAULT 'draft' NOT NULL,
	"linkUrl" text,
	"isFeatured" boolean DEFAULT false,
	"publishedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "commentTable" (
	"userId" integer NOT NULL,
	"articleId" integer NOT NULL,
	"content" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "commentTable_userId_articleId_pk" PRIMARY KEY("userId","articleId")
);
--> statement-breakpoint
CREATE TABLE "genreTable" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "genreTable_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "genreXArticle" (
	"genreId" integer NOT NULL,
	"articleId" integer NOT NULL,
	CONSTRAINT "genreXArticle_articleId_genreId_pk" PRIMARY KEY("articleId","genreId")
);
--> statement-breakpoint
CREATE TABLE "labelTable" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "labelTable_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "labelXArticle" (
	"labelId" integer NOT NULL,
	"articleId" integer NOT NULL,
	CONSTRAINT "labelXArticle_articleId_labelId_pk" PRIMARY KEY("articleId","labelId")
);
--> statement-breakpoint
CREATE TABLE "likeTable" (
	"userId" integer NOT NULL,
	"articleId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "likeTable_userId_articleId_pk" PRIMARY KEY("userId","articleId")
);
--> statement-breakpoint
CREATE TABLE "userTable" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"clerkId" text NOT NULL,
	"name" text,
	"bio" text,
	"location" text,
	"lastLogin" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp,
	CONSTRAINT "userTable_username_unique" UNIQUE("username"),
	CONSTRAINT "userTable_email_unique" UNIQUE("email"),
	CONSTRAINT "userTable_clerkId_unique" UNIQUE("clerkId")
);
--> statement-breakpoint
ALTER TABLE "articleTable" ADD CONSTRAINT "articleTable_authorId_userTable_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."userTable"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commentTable" ADD CONSTRAINT "commentTable_userId_userTable_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."userTable"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commentTable" ADD CONSTRAINT "commentTable_articleId_articleTable_id_fk" FOREIGN KEY ("articleId") REFERENCES "public"."articleTable"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "genreXArticle" ADD CONSTRAINT "genreXArticle_genreId_genreTable_id_fk" FOREIGN KEY ("genreId") REFERENCES "public"."genreTable"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "genreXArticle" ADD CONSTRAINT "genreXArticle_articleId_articleTable_id_fk" FOREIGN KEY ("articleId") REFERENCES "public"."articleTable"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "labelXArticle" ADD CONSTRAINT "labelXArticle_labelId_labelTable_id_fk" FOREIGN KEY ("labelId") REFERENCES "public"."labelTable"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "labelXArticle" ADD CONSTRAINT "labelXArticle_articleId_articleTable_id_fk" FOREIGN KEY ("articleId") REFERENCES "public"."articleTable"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likeTable" ADD CONSTRAINT "likeTable_userId_userTable_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."userTable"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likeTable" ADD CONSTRAINT "likeTable_articleId_articleTable_id_fk" FOREIGN KEY ("articleId") REFERENCES "public"."articleTable"("id") ON DELETE cascade ON UPDATE no action;