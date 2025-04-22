"use client";

import { Button } from "./ui/button";
import {
  ChevronRight,
  ChevronLeft,
  ChevronLast,
  ChevronFirst,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const Pagination = ({ totalPages }: { totalPages: number }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") ?? "1");

  const handleNext = () => {
    if (page < totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", (page + 1).toString());
      router.push(`?${params.toString()}`);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      const params = new URLSearchParams(searchParams.toString());
      if (page === 2) params.delete("page");
      else params.set("page", (page - 1).toString());
      router.push(`?${params.toString()}`);
    }
  };

  const handleFirst = () => {
    if (page > 1) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      router.push(`?${params.toString()}`);
    }
  };

  const handleLast = () => {
    if (page < totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", totalPages.toString());
      router.push(`?${params.toString()}`);
    }
  };

  return (
    <div className="bg-background flex justify-between items-center mt-4 p-2 rounded-md w-[300px]">
      <Button variant="secondary" onClick={handleFirst} disabled={page === 1}>
        <ChevronFirst></ChevronFirst>
      </Button>
      <Button variant="secondary" onClick={handlePrev} disabled={page === 1}>
        <ChevronLeft></ChevronLeft>
      </Button>
      <span className="whitespace-pre">{`${page}  /  ${totalPages}`}</span>
      <Button
        variant="secondary"
        onClick={handleNext}
        disabled={page === totalPages}
      >
        <ChevronRight></ChevronRight>
      </Button>
      <Button
        variant="secondary"
        onClick={handleLast}
        disabled={page === totalPages}
      >
        <ChevronLast></ChevronLast>
      </Button>
    </div>
  );
};

const PaginationWrapper = ({ totalPages }: { totalPages: number }) => {
  return (
    <Suspense>
      <Pagination totalPages={totalPages}></Pagination>
    </Suspense>
  );
};

export default PaginationWrapper;
