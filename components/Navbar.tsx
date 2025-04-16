import React from "react";
import GenreSelect from "./GenreSelect";
import { getGenres } from "@/actions/genre.actions";
import Link from "next/link";
import SearchInput from "./SearchInput";

const Navbar = async ({
  showFilters,
  title,
}: {
  showFilters?: boolean;
  title?: string;
}) => {
  const genres = await getGenres();

  return (
    <header className="w-full sticky top-0">
      <nav className="h-16 w-full px-8 flex items-center justify-between z-10 bg-background">
        <div className="flex gap-4">
          <div className="flex flex-col gap-1">
            <div className="bg-primary-light w-2 h-2"></div>
            <div className="bg-primary w-2 h-2"></div>
            <div className="bg-primary-dark w-2 h-2"></div>
          </div>
          <Link href={"/"}>
            <span className="text-xl flex items-center">
              {title ?? "bookshelf"}
            </span>
          </Link>
        </div>
        {showFilters && (
          <div className="flex gap-8">
            <GenreSelect genres={genres}></GenreSelect>
            <SearchInput></SearchInput>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
