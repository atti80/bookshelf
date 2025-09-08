"use client";

import React from "react";
import GenreSelectWrapper from "./GenreSelect";
import Link from "next/link";
import SearchInputWrapper from "./SearchInput";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CircleUserRound } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";

type NavbarProps = {
  children: React.ReactElement<{ closePopover?: () => void }>;
  translations: Record<string, string>;
  categories: any;
};

const Navbar = ({ children, translations, categories }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [isPopover, setIsPopover] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`relative ${
        scrolled ? "h-16 lg:h-20" : "h-16 lg:h-40"
      } w-full px-2 xs:px-8 flex items-center justify-between z-999 bg-background transition-all duration-800`}
    >
      <div className="flex h-full gap-4">
        <Link href="/">
          <div
            className={`absolute h-full flex items-center ${
              scrolled
                ? "left-10 top-0 translate-x-0 translate-y-0"
                : "left-10 top-0 translate-x-0 translate-y-0 lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2"
            } transition-all duration-500`}
          >
            <span
              className={`${
                scrolled ? "text-2xl" : "text-5xl xl:text-6xl"
              } items-center hidden lg:flex transition-all duration-500 mr-2`}
            >
              KÖNYV
            </span>
            <div
              className={`flex items-center transition-all duration-500 ${
                scrolled ? "w-12 lg:w-16" : "w-12 lg:w-40"
              }`}
            >
              <Image
                src="/images/redhead_round.png"
                alt="logo"
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto"
              ></Image>
            </div>
            <span className="ml-2 text-lg lg:hidden">KÖNYVELVONÓ</span>
            <span
              className={`${
                scrolled ? "text-2xl" : "text-5xl xl:text-6xl"
              } items-center hidden lg:flex transition-all duration-500 ml-2`}
            >
              ELVONÓ
            </span>
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex max-md:flex-col-reverse max-md:hidden gap-2 lg:gap-8">
          <GenreSelectWrapper
            genres={categories}
            allGenresText={translations["all_genres"] || "All Genres"}
          ></GenreSelectWrapper>
          <SearchInputWrapper
            closePopover={() => setIsPopover(false)}
            searchPlaceholder={translations["search"] || "Search"}
          ></SearchInputWrapper>
        </div>
        <div className="flex items-center w-20 h-full md:hidden text-background">
          <Popover open={isPopover} onOpenChange={(open) => setIsPopover(open)}>
            <PopoverTrigger>
              <CircleUserRound
                strokeWidth={1}
                size={44}
                className="w-full h-auto bg-primary-dark rounded-full"
              ></CircleUserRound>
            </PopoverTrigger>
            <PopoverContent style={{ padding: 0 }}>
              <div className="flex flex-col items-center">
                <div className="flex flex-col items-center gap-2 justify-center my-2">
                  <SearchInputWrapper
                    searchPlaceholder={translations["search"] || "Search"}
                    closePopover={() => setIsPopover(false)}
                  ></SearchInputWrapper>
                  <GenreSelectWrapper
                    genres={categories}
                    allGenresText={translations["all_genres"] || "All Genres"}
                    closePopover={() => setIsPopover(false)}
                  ></GenreSelectWrapper>
                </div>
                <Separator></Separator>
                {React.Children.map(children, (child) => {
                  if (React.isValidElement(child)) {
                    return React.cloneElement(child, {
                      closePopover: () => setIsPopover(false),
                    });
                  }
                  return child;
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
