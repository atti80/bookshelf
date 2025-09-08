"use client";

import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "./ui/button";

const SearchInput = ({
  searchPlaceholder,
  closePopover,
}: {
  searchPlaceholder: string;
  closePopover?: () => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const currentSearch = searchParams.get("search") ?? "";
    setSearchText(currentSearch);
  }, [searchParams]);

  const handleClick = () => {
    if (closePopover) closePopover();
    if (searchText.length) router.push(`${pathname}?search=${searchText}`);
    else router.push(pathname);
  };

  return (
    <div className="flex w-[200px] h-8 items-center gap-1">
      <Input
        className={`h-full ${closePopover ? "text-sm" : ""}`}
        placeholder={`${searchPlaceholder}...`}
        value={searchText}
        onChange={(v) => {
          setSearchText(v.target.value);
        }}
      ></Input>
      <Button variant="secondary" onClick={handleClick}>
        {" "}
        <Search></Search>{" "}
      </Button>
    </div>
  );
};

const SearchInputWrapper = ({
  searchPlaceholder,
  closePopover,
}: {
  searchPlaceholder: string;
  closePopover?: () => void;
}) => {
  return (
    <Suspense>
      <SearchInput
        closePopover={closePopover}
        searchPlaceholder={searchPlaceholder}
      ></SearchInput>
    </Suspense>
  );
};

export default SearchInputWrapper;
