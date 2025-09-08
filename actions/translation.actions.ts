"use server";

import { eq, and, inArray } from "drizzle-orm";
import { db } from "@/db/db";
import { Translation } from "@/db/schema";

export async function getTranslations(
  keys?: string[]
): Promise<Record<string, string>> {
  const result = await db.query.Translation.findMany({
    where: and(
      eq(
        Translation.languageCode,
        process.env.NEXT_PUBLIC_SITE_LANGUAGE || "en"
      ),
      keys ? inArray(Translation.translationKey, keys) : undefined
    ),
    columns: { translationKey: true, translationText: true },
  });

  return result.reduce((acc, curr) => {
    acc[curr.translationKey] = curr.translationText;
    return acc;
  }, {} as Record<string, string>);
}
