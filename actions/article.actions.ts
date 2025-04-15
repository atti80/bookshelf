"use server";

import { db } from "@/db/db";
import { Article, Genre, GenreToArticle, Like } from "@/db/schema";
import { and, desc, eq, inArray, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getArticles = async (
  genre: string | null,
  search: string | null
) => {
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
        : undefined,
      search ? ilike(Article.title, `%${search}%`) : undefined
    ),
    columns: {
      status: false,
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
    columns: {
      status: false,
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
  });
};

export const toggleLike = async (userId: number, articleId: number) => {
  try {
    const existingLike = await db.query.Like.findFirst({
      where: and(eq(Like.articleId, articleId), eq(Like.userId, userId)),
    });

    if (existingLike) {
      await db
        .delete(Like)
        .where(and(eq(Like.articleId, articleId), eq(Like.userId, userId)));
    } else {
      await db.insert(Like).values({
        userId: userId,
        articleId: articleId,
      });
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle like:", error);
    return { success: false, error: "Failed to toggle like" };
  }
};
