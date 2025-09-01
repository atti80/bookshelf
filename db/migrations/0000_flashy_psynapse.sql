CREATE TABLE "commentTable" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"articleId" integer NOT NULL,
	"content" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "languages" (
	"code" varchar(5) PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "likeTable" (
	"userId" integer NOT NULL,
	"articleId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "likeTable_userId_articleId_pk" PRIMARY KEY("userId","articleId")
);
--> statement-breakpoint
CREATE TABLE "translations" (
	"translationKey" varchar(255) NOT NULL,
	"languageCode" varchar(5) NOT NULL,
	"translationText" text NOT NULL,
	CONSTRAINT "translations_translationKey_languageCode_pk" PRIMARY KEY("translationKey","languageCode")
);
--> statement-breakpoint
CREATE TABLE "userTable" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"salt" text NOT NULL,
	"name" text,
	"location" text,
	"bio" text,
	"isActive" boolean DEFAULT true,
	"isAdmin" boolean DEFAULT false,
	"lastLogin" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp,
	CONSTRAINT "userTable_email_unique" UNIQUE("email"),
	CONSTRAINT "userTable_password_unique" UNIQUE("password"),
	CONSTRAINT "userTable_salt_unique" UNIQUE("salt")
);
--> statement-breakpoint
ALTER TABLE "translations" ADD CONSTRAINT "translations_languageCode_languages_code_fk" FOREIGN KEY ("languageCode") REFERENCES "public"."languages"("code") ON DELETE no action ON UPDATE no action;