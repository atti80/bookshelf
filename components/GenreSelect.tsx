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
  closePopover,
}: {
  genres: { id: number; name: string }[];
  allGenresText: string;
  closePopover?: () => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const genre = searchParams.get("category");

  const handleGenreChange = (genre: string) => {
    if (closePopover) closePopover();
    if (genre === "0") router.push(pathname);
    else router.push(`${pathname}?category=${genre}`);
  };

  return (
    <div className="lg:hidden">
      <Select value={genre ?? "0"} onValueChange={handleGenreChange}>
        <SelectTrigger className="w-[200px] !h-8 text-xs">
          <SelectValue placeholder="Select a genre" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem key={0} value="0" className="text-xs">
              {allGenresText}
            </SelectItem>
            {genres.map((genre) => (
              <SelectItem
                key={genre.id}
                value={genre.id.toString()}
                className="text-xs"
              >
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
  closePopover,
}: {
  genres: { id: number; name: string }[];
  allGenresText: string;
  closePopover?: () => void;
}) => {
  return (
    <Suspense>
      <GenreSelect
        genres={genres}
        allGenresText={allGenresText}
        closePopover={closePopover}
      ></GenreSelect>
    </Suspense>
  );
};

export default GenreSelectWrapper;
