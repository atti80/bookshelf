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

type Genres = Awaited<ReturnType<typeof getGenres>>;

const GenreSelect = ({ genres }: { genres: Genres }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const genre = searchParams.get("genre");

  return (
    <div>
      <Select
        value={genre ?? "all"}
        onValueChange={(genre) => {
          router.push(`${pathname}?genre=${genre}`);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a genre" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem key={0} value="all">
              All genres
            </SelectItem>
            {genres.map((genre) => (
              <SelectItem key={genre.id} value={genre.name}>
                {genre.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default GenreSelect;
