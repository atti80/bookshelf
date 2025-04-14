ALTER TABLE "userTable" DROP CONSTRAINT "userTable_username_unique";--> statement-breakpoint
ALTER TABLE "userTable" DROP CONSTRAINT "userTable_clerkId_unique";--> statement-breakpoint
ALTER TABLE "userTable" ADD COLUMN "password" text NOT NULL;--> statement-breakpoint
ALTER TABLE "userTable" ADD COLUMN "salt" text NOT NULL;--> statement-breakpoint
ALTER TABLE "userTable" DROP COLUMN "username";--> statement-breakpoint
ALTER TABLE "userTable" DROP COLUMN "clerkId";--> statement-breakpoint
ALTER TABLE "userTable" ADD CONSTRAINT "userTable_password_unique" UNIQUE("password");--> statement-breakpoint
ALTER TABLE "userTable" ADD CONSTRAINT "userTable_salt_unique" UNIQUE("salt");