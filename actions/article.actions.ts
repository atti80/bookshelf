"use server";

import { db } from "@/db/db";
import { Article, Genre, GenreToArticle, Like, StatusType } from "@/db/schema";
import { and, desc, eq, inArray, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getArticles = async (
  status?: StatusType,
  genre?: string,
  search?: string,
  limit?: number,
  offset?: number
) => {
  return await db.query.Article.findMany({
    where: and(
      status && eq(Article.status, status),
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
    limit: limit,
    offset: offset,
  });
};

export const getArticle = async (id: number) => {
  return await db.query.Article.findFirst({
    where: eq(Article.id, id),
    columns: {
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

export const createArticle = async (
  title: string,
  content: string,
  userId: number
) => {
  try {
    const result = await db.insert(Article).values({
      title: title,
      content: content,
      authorId: userId,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to create article", error);
    return { success: false, error: "Failed to create article" };
  }
};

export const updateArticle = async (
  id: number,
  title: string,
  content: string
) => {
  try {
    const result = await db
      .update(Article)
      .set({
        title: title,
        content: content,
      })
      .where(eq(Article.id, id));

    return { success: true };
  } catch (error) {
    console.error("Failed to update article", error);
    return { success: false, error: "Failed to update article" };
  }
};

export const togglePublishArticle = async (id: number) => {
  try {
    const article = await db.query.Article.findFirst({
      where: eq(Article.id, id),
    });

    if (article?.status === "draft") {
      await db
        .update(Article)
        .set({
          publishedAt: new Date(),
          status: "published",
        })
        .where(eq(Article.id, id));
    } else {
      await db
        .update(Article)
        .set({
          status: "draft",
        })
        .where(eq(Article.id, id));
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to publish/unpublish article", error);
    return { success: false, error: "Failed to publish/unpublish article" };
  }
};

export const deleteArticle = async (id: number) => {
  try {
    await db.delete(Article).where(eq(Article.id, id));

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete article", error);
    return { success: false, error: "Failed to delete article" };
  }
};
