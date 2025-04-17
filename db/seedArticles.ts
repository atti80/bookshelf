import { db } from "@/db/db";
import { Article } from "@/db/schema";
import { articles2 } from "./data";

const articles = articles2.map((article) => ({
  ...article,
  status: article.status as "draft" | "published" | "deleted",
}));

async function seed() {
  console.log("Seeding database...");
  await db.insert(Article).values(articles);
  console.log("Database seeded successfully!");
}

seed()
  .then()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  });
