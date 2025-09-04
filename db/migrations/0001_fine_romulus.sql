CREATE TABLE "passwordRequests" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"token" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"usedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "passwordRequests_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "passwordRequests" ADD CONSTRAINT "passwordRequests_userId_userTable_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."userTable"("id") ON DELETE cascade ON UPDATE no action;