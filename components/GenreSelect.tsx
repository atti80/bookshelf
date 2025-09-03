"use client";

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

const GenreSelect = ({
  genres,
  allGenresText,
}: {
  genres: { id: number; name: string }[];
  allGenresText: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const genre = searchParams.get("category");

  const handleGenreChange = (genre: string) => {
    if (genre === "0") router.push(pathname);
    else router.push(`${pathname}?category=${genre}`);
  };

  return (
    <div>
      <Select value={genre ?? "0"} onValueChange={handleGenreChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a genre" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem key={0} value="0">
              {allGenresText}
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

const GenreSelectWrapper = ({
  genres,
  allGenresText,
}: {
  genres: { id: number; name: string }[];
  allGenresText: string;
}) => {
  return (
    <Suspense>
      <GenreSelect genres={genres} allGenresText={allGenresText}></GenreSelect>
    </Suspense>
  );
};

export default GenreSelectWrapper;
