"use server";

import { db } from "@/db/db";
import { Article, Genre, GenreToArticle } from "@/db/schema";
import { and, desc, eq, inArray } from "drizzle-orm";

export const getArticles = async (genre: string | null) => {
  return await db.query.Article.findMany({
    where: and(
      eq(Article.status, "published"),
      genre && genre !== "all"
        ? inArray(
            Article.id,
            db
              .select({ id: GenreToArticle.articleId })
              .from(GenreToArticle)
              .innerJoin(Genre, eq(GenreToArticle.genreId, Genre.id))
              .where(eq(Genre.name, genre))
          )
        : undefined
    ),
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
      comments: {},
    },
    orderBy: [desc(Article.publishedAt)],
  });
};

export const getArticle = async (id: number) => {
  return await db.query.Article.findFirst({
    where: eq(Article.id, id),
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
  });
};
