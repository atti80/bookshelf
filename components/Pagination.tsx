import { Button } from "./ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const Pagination = ({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNext = () => {
    if (currentPage < totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", (currentPage + 1).toString());
      router.push(`?${params.toString()}`);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", (currentPage - 1).toString());
      router.push(`?${params.toString()}`);
    }
  };

  return (
    <div className="bg-background flex justify-between items-center mt-4 p-2 rounded-md w-[200px]">
      <Button variant="secondary" onClick={handlePrev}>
        <ChevronLeft></ChevronLeft>
      </Button>
      <span className="whitespace-pre">{`${currentPage}  /  ${totalPages}`}</span>
      <Button variant="secondary" onClick={handleNext}>
        <ChevronRight></ChevronRight>
      </Button>
    </div>
  );
};

export default Pagination;
