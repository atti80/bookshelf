"use client";

import { getArticles } from "@/actions/article.actions";
import Image from "next/image";
import Genres from "./Genres";
import ReadMore from "./ReadMore";
import { useEffect, useState } from "react";
import {
  HeartIcon,
  LogInIcon,
  MessageCircleIcon,
  SendIcon,
} from "lucide-react";

type Articles = Awaited<ReturnType<typeof getArticles>>;
type Article = Articles[number];

const bucketUrl = process.env.NEXT_PUBLIC_AWS_BUCKET_URL;

const Article = ({
  article,
  userId,
}: {
  article: Article;
  userId: number | null;
}) => {
  const [imageUrl, setImageUrl] = useState("/images/bookshelf.jpg");

  useEffect(() => {
    if (bucketUrl) setImageUrl(`${bucketUrl}/${article.image}`);
  }, []);

  return (
    <div className="bg-background p-12 flex flex-col items-center gap-8 rounded-md">
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between">
          <Genres genres={article.genres}></Genres>
          <div className="flex gap-8">
            <div className="flex gap-2">
              <HeartIcon className="size-5" />
              {article.likes.length}
            </div>
            <div className="flex gap-2">
              <MessageCircleIcon className="size-5" />
              {article.comments.length}
            </div>
          </div>
        </div>
        <h2 className="mt-4">{article.title}</h2>
        <p className="font-light text-gray-400">by {article.author.name}</p>
      </div>
      <div className="flex gap-12 h-60">
        <Image
          src={imageUrl}
          width={200}
          height={200}
          alt={article.image ? article.image : "No image"}
          style={{ objectFit: "contain" }}
        ></Image>
        <div className="flex flex-col justify-between">
          <article className="line-clamp-8">
            {article.content.substring(0, 600)}
          </article>
          <ReadMore id={article.id}></ReadMore>
        </div>
      </div>
    </div>
  );
};

export default Article;
