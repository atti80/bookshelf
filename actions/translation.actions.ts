import { eq, and } from "drizzle-orm";
import { db } from "@/db/db";
import { Translation } from "@/db/schema";

export async function getTranslation(languageCode: string, key: string) {
  const result = await db
    .select({ text: Translation.translationText })
    .from(Translation)
    .where(
      and(
        eq(Translation.languageCode, languageCode),
        eq(Translation.translationKey, key)
      )
    )
    .limit(1);

  return result[0]?.text ?? null;
}
