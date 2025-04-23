import React from "react";
import GenreSelectWrapper from "./GenreSelect";
import { getGenres } from "@/actions/genre.actions";
import Link from "next/link";
import SearchInputWrapper from "./SearchInput";

const Navbar = async ({
  showFilters,
  title,
  linkUrl,
}: {
  showFilters?: boolean;
  title?: string;
  linkUrl?: string;
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
          <Link href={linkUrl ? linkUrl : "/"}>
            <span className="text-xl items-center hidden md:flex">
              {title ?? "bookshelf"}
            </span>
          </Link>
        </div>
        {showFilters && (
          <div className="flex gap-2 lg:gap-8">
            <GenreSelectWrapper genres={genres}></GenreSelectWrapper>
            <SearchInputWrapper></SearchInputWrapper>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
