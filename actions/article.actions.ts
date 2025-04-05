"use server";

import { db } from "@/db/db";
import { Article } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";

export const getArticles = async () => {
  return await db.query.Article.findMany({
    where: eq(Article.status, "published"),
    columns: {
      status: false,
      createdAt: false,
      updatedAt: false,
    },
    with: {
      author: {
        columns: {
          name: true,
        },
      },
      genres: {
        with: {
          genre: {
            columns: {
              name: true,
            },
          },
        },
      },
      labels: {
        with: {
          label: {
            columns: {
              name: true,
            },
          },
        },
      },
      likes: {},
    },
    orderBy: [desc(Article.publishedAt)],
  });
};
