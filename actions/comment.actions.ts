"use server";

import { db } from "@/db/db";
import { Comment } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getComments = async (articleId: number) => {
  return await db.query.Comment.findMany({
    where: eq(Comment.articleId, articleId),
    with: {
      user: {
        columns: {
          name: true,
        },
      },
    },
    orderBy: [desc(Comment.createdAt)],
  });
};

export const createComment = async (
  articleId: number,
  userId: number,
  content: string
) => {
  try {
    const comment = await db
      .insert(Comment)
      .values({
        articleId,
        userId,
        content,
      })
      .returning();

    revalidatePath(`/article/${articleId}`);
    return { success: true, data: comment[0] };
  } catch (error) {
    console.error("Failed to create comment:", error);
    return { success: false, error: "Failed to create comment" };
  }
};

export const deleteComment = async (commentId: number) => {
  await db.delete(Comment).where(eq(Comment.id, commentId));
};
