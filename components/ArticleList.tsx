"use client";

import { getArticles } from "@/actions/article.actions";
import Article from "./Article";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Articles = Awaited<ReturnType<typeof getArticles>>;

const ArticleList = ({ userId }: { userId: number | null }) => {
  const searchParams = useSearchParams();
  const genre = searchParams.get("genre") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const [articles, setArticles] = useState<Articles>([]);

  useEffect(() => {
    const loadArticles = async () => {
      setArticles(await getArticles("published", genre, search));
    };
    loadArticles();
  }, [genre, search]);

  return (
    <div className="px-8 col-start-2 col-span-4 grid grid-cols-4 gap-8">
      {articles.map((article) => (
        <Article key={article.id} article={article} userId={userId}></Article>
      ))}
    </div>
  );
};

export default ArticleList;
