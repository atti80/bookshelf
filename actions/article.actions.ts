"use server";

import { db } from "@/db/db";
import { Article, GenreToArticle, Like, StatusType } from "@/db/schema";
import { and, desc, eq, inArray, ilike, notInArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface Result {
  success: boolean;
  error?: string;
}

export const getArticles = async (
  status?: StatusType,
  genreId?: number,
  search?: string,
  limit?: number,
  offset?: number
): Promise<{
  count: number;
  articles: {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    publishedAt: Date | null;
    status: StatusType;
    authorId: number;
    image: string | null;
    author: {
      name: string | null;
    };
    genres: {
      genreId: number;
      genre: { name: string };
    }[];
    labels: {
      label: { name: string };
    }[];
    likes: {
      userId: number;
      articleId: number;
      createdAt: Date | null;
    }[];
    comments: {
      userId: number;
      articleId: number;
      createdAt: Date | null;
      content: string | null;
    }[];
  }[];
}> => {
  const count = await db.$count(
    Article,
    and(
      status ? eq(Article.status, status) : undefined,
      search ? ilike(Article.title, `%${search}%`) : undefined,
      genreId && genreId !== 0
        ? inArray(
            Article.id,
            db
              .select({ id: GenreToArticle.articleId })
              .from(GenreToArticle)
              .where(eq(GenreToArticle.genreId, genreId))
          )
        : undefined
    )
  );

  const articles = await db.query.Article.findMany({
    where: and(
      status && eq(Article.status, status),
      genreId && genreId !== 0
        ? inArray(
            Article.id,
            db
              .select({ id: GenreToArticle.articleId })
              .from(GenreToArticle)
              .where(eq(GenreToArticle.genreId, genreId))
          )
        : undefined,
      search ? ilike(Article.title, `%${search}%`) : undefined
    ),
    columns: {
      linkUrl: false,
      isFeatured: false,
      updatedAt: false,
    },
    with: {
      author: {
        columns: {
          name: true,
        },
      },
      genres: {
        columns: {
          articleId: false,
        },
        with: {
          genre: {
            columns: {
              name: true,
            },
          },
        },
      },
      labels: {
        columns: {
          articleId: false,
          labelId: false,
        },
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

  return { count: count, articles: articles };
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
  authorId: number,
  title: string,
  content: string,
  image: string,
  genreIds?: number[]
): Promise<Result> => {
  try {
    const newArticle = await db
      .insert(Article)
      .values({
        title: title,
        content: content,
        authorId: authorId,
        image: image,
      })
      .returning();

    if (genreIds && genreIds.length > 0) {
      await db.insert(GenreToArticle).values(
        genreIds.map((genreId) => ({
          articleId: newArticle[0].id,
          genreId: genreId,
        }))
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to create article", error);
    return { success: false, error: "Failed to create article" };
  }
};

export const updateArticle = async (
  id: number,
  title: string,
  content: string,
  image: string,
  genreIds?: number[]
): Promise<Result> => {
  try {
    const result = await db
      .update(Article)
      .set({
        title: title,
        content: content,
        image: image,
      })
      .where(eq(Article.id, id));

    if (genreIds && genreIds.length > 0) {
      await db
        .delete(GenreToArticle)
        .where(
          and(
            eq(GenreToArticle.articleId, id),
            notInArray(GenreToArticle.genreId, genreIds)
          )
        );

      await db
        .insert(GenreToArticle)
        .values(
          genreIds.map((genreId) => ({
            articleId: id,
            genreId: genreId,
          }))
        )
        .onConflictDoNothing();
    }

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
