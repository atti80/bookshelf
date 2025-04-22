"use client";

import { getGenres } from "@/actions/genre.actions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

type Genres = Awaited<ReturnType<typeof getGenres>>;

const GenreSelect = ({ genres }: { genres: Genres }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const genre = searchParams.get("genre");

  const handleGenreChange = (genre: string) => {
    if (genre === "0") router.push(pathname);
    else router.push(`${pathname}?genre=${genre}`);
  };

  return (
    <div>
      <Select value={genre ?? "0"} onValueChange={handleGenreChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a genre" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem key={0} value="0">
              All genres
            </SelectItem>
            {genres.map((genre) => (
              <SelectItem key={genre.id} value={genre.id.toString()}>
                {genre.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

const GenreSelectWrapper = ({ genres }: { genres: Genres }) => {
  return (
    <Suspense>
      <GenreSelect genres={genres}></GenreSelect>
    </Suspense>
  );
};

export default GenreSelectWrapper;
