import { db } from "@/db/db";
import { Like } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
