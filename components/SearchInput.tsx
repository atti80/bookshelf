"use client";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const SearchInput = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const currentSearch = searchParams.get("search") ?? "";
    setSearchText(currentSearch);
  }, [searchParams]);

  return (
    <div className="flex gap-1">
      <Input
        placeholder="search..."
        value={searchText}
        onChange={(v) => {
          setSearchText(v.target.value);
        }}
      ></Input>
      <Button
        variant="secondary"
        onClick={() => {
          if (searchText.length)
            router.push(`${pathname}?search=${searchText}`);
          else router.push(pathname);
        }}
      >
        {" "}
        <Search></Search>{" "}
      </Button>
    </div>
  );
};

const SearchInputWrapper = () => {
  return (
    <Suspense>
      <SearchInput></SearchInput>
    </Suspense>
  );
};

export default SearchInputWrapper;
