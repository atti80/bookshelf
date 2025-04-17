"use client";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SearchInput = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParam = searchParams.get("search") ?? "";
  const [searchText, setSearchText] = useState(searchParam);

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

export default SearchInput;
