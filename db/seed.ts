import { db } from "@/db/db";
import { Article, Genre, Label, User } from "@/db/schema";
import { users, genres, labels, articles as rawArticles } from "./data";

// Ensure articles have valid status values
const articles = rawArticles.map((article) => ({
  ...article,
  status: article.status as "draft" | "published" | "deleted",
}));

async function seed() {
  console.log("Seeding database...");

  // ----------------------------------------------------------
  // USERS
  // ----------------------------------------------------------
  for (const user of users) {
    const dbUser = await db
      .insert(User)
      .values(user)
      .onConflictDoUpdate({
        target: User.username,
        set: {
          name: user.name,
          email: user.email,
          clerkId: user.clerkId,
        },
      })
      .returning();

    console.log(`User seeded: ${dbUser[0].id} ${dbUser[0].username}`);
  }

  // ----------------------------------------------------------
  // GENRES
  // ----------------------------------------------------------
  for (const genre of genres) {
    await db.insert(Genre).values({ name: genre }).onConflictDoNothing();
    console.log(`Genre seeded: ${genre}`);
  }

  // ----------------------------------------------------------
  // LABELS
  // ----------------------------------------------------------
  for (const label of labels) {
    await db.insert(Label).values({ name: label }).onConflictDoNothing();
    console.log(`Label seeded: ${label}`);
  }

  // ----------------------------------------------------------
  // ARTICLES
  // ----------------------------------------------------------
  await db.insert(Article).values(articles);

  console.log("Database seeded successfully!");
}

seed()
  .then()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  });
