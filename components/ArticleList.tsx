"use client";

import { getArticles } from "@/actions/article.actions";
import Article from "./Article";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Articles = Awaited<ReturnType<typeof getArticles>>;

const ArticleList = () => {
  const searchParams = useSearchParams();
  const genre = searchParams.get("genre");
  const [articles, setArticles] = useState<Articles>([]);

  useEffect(() => {
    const loadArticles = async () => {
      setArticles(await getArticles(genre));
    };
    loadArticles();
  }, [genre]);

  return (
    <div className="flex flex-col gap-8 w-3xl col-start-2 col-span-3">
      {articles.map((article) => (
        <Article key={article.id} article={article} userId={0}></Article>
      ))}
    </div>
  );
};

export default ArticleList;
