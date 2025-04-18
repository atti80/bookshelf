"use client";

import { getArticles } from "@/actions/article.actions";
import Article from "./Article";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Pagination from "./Pagination";

type Articles = Awaited<ReturnType<typeof getArticles>>["articles"];
const ARTICLES_PER_PAGE = 10;

const ArticleList = ({ userId }: { userId: number | undefined }) => {
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<Articles>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const genreParam = searchParams.get("genre") ?? undefined;
    const searchParam = searchParams.get("search") ?? undefined;
    const pageParam = searchParams.get("page") ?? undefined;
    const page = parseInt(pageParam ?? "1");

    const loadArticles = async () => {
      const result = await getArticles(
        "published",
        parseInt(genreParam ?? "0"),
        searchParam,
        ARTICLES_PER_PAGE,
        (page - 1) * ARTICLES_PER_PAGE
      );

      setArticles(result.articles);
      setTotalPages(Math.ceil(result.count / ARTICLES_PER_PAGE));
    };
    setCurrentPage(page);
    loadArticles();
  }, [searchParams]);

  return (
    <div className="px-8 col-start-2 col-span-4">
      {articles.length ? (
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-4 gap-8">
            {articles.map((article) => (
              <Article
                key={article.id}
                article={article}
                userId={userId}
              ></Article>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
          ></Pagination>
        </div>
      ) : (
        <h2>No articles found</h2>
      )}
    </div>
  );
};

export default ArticleList;
