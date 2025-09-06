"use server";

import { db } from "@/db/db";
import { PageViews } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export const getHomeViews = async () => {
  try {
    const homePage = await db.query.PageViews.findFirst({
      where: eq(PageViews.pageId, 0),
    });
    return homePage?.views;
  } catch (error) {
    console.error("Failed to get home page views: ", error);
    throw error;
  }
};

export const incrementPageViews = async (pageId: number) => {
  try {
    const result = await db
      .insert(PageViews)
      .values({ pageId })
      .onConflictDoUpdate({
        target: PageViews.pageId,
        set: {
          views: sql`${PageViews.views} + 1`,
        },
      })
      .returning();

    return result[0].views;
  } catch (error) {
    console.error("Failed to increment views: ", error);
    throw error;
  }
};

export const getPageViews = async (pageId: number) => {
  try {
    const page = await db.query.PageViews.findFirst({
      where: eq(PageViews.pageId, pageId),
    });
    return page?.views;
  } catch (error) {
    console.error("Failed to get page views: ", error);
    throw error;
  }
};
