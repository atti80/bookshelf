import React from "react";
import GenreSelectWrapper from "./GenreSelect";
import Link from "next/link";
import SearchInputWrapper from "./SearchInput";
import { fetchCategories } from "@/actions/wordpress.actions";
import { getCachedTranslations } from "@/actions/translation.helper";

const genres = await fetchCategories();
const translations = await getCachedTranslations([
  "home_title",
  "search",
  "all_genres",
]);

const Navbar = async ({
  showFilters,
  title,
  linkUrl,
}: {
  showFilters?: boolean;
  title?: string;
  linkUrl?: string;
}) => {
  return (
    <header className="w-full sticky top-0">
      <nav className="h-16 w-full px-2 xs:px-8 flex items-center justify-between z-999 bg-background">
        <div className="flex gap-4 max-xs:hidden">
          <div className="flex flex-col gap-1">
            <div className="bg-primary-light w-2 h-2"></div>
            <div className="bg-primary w-2 h-2"></div>
            <div className="bg-primary-dark w-2 h-2"></div>
          </div>
          <Link href={linkUrl ? linkUrl : "/"}>
            <span className="text-xl items-center hidden md:flex">
              {title ??
                (translations["home_title"].toUpperCase() || "bookshelf")}
            </span>
          </Link>
        </div>
        {showFilters && (
          <div className="flex max-xs:grow-1 max-xs:gap-1 gap-2 lg:gap-8">
            <GenreSelectWrapper
              genres={genres}
              allGenresText={translations["all_genres"] || "All Genres"}
            ></GenreSelectWrapper>
            <SearchInputWrapper
              searchPlaceholder={translations["search"] || "Search"}
            ></SearchInputWrapper>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
