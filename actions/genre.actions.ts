"use server";

import { db } from "@/db/db";
import { Genre } from "@/db/schema";
import { asc } from "drizzle-orm";

export type Genres = Awaited<ReturnType<typeof getGenres>>;
export type GenreItem = Genres[number];

export const getGenres = async () => {
  return await db.query.Genre.findMany({
    orderBy: asc(Genre.name),
  });
};
