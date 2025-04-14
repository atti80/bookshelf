"use client";

import { getArticles, toggleLike } from "@/actions/article.actions";
import Image from "next/image";
import Genres from "./Genres";
import ReadMore from "./ReadMore";
import { useEffect, useState } from "react";
import { HeartIcon, MessageCircleIcon } from "lucide-react";
import { Button } from "./ui/button";
import { format } from "date-fns";

type Articles = Awaited<ReturnType<typeof getArticles>>;
type Article = Articles[number];

const bucketUrl = process.env.NEXT_PUBLIC_AWS_BUCKET_URL;

const Article = ({
  article,
  userId,
  fullContent = false,
}: {
  article: Article;
  userId: number | null;
  fullContent?: boolean;
}) => {
  const [imageUrl, setImageUrl] = useState("/images/bookshelf.jpg");
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(
    article.likes.some((like) => like.userId === userId)
  );
  const [optimisticLikes, setOptmisticLikes] = useState(article.likes.length);

  useEffect(() => {
    if (bucketUrl) setImageUrl(`${bucketUrl}/${article.image}`);
  }, []);

  const handleLike = async () => {
    if (!userId || isLiking) return;
    try {
      setIsLiking(true);
      setHasLiked((prev) => !prev);
      setOptmisticLikes((prev) => prev + (hasLiked ? -1 : 1));
      await toggleLike(userId, article.id);
    } catch (error) {
      setOptmisticLikes(article.likes.length);
      setHasLiked(article.likes.some((like) => like.userId === userId));
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="bg-background p-12 flex flex-col items-center gap-8 rounded-md">
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between mb-4">
          <Genres genres={article.genres}></Genres>
          <div className="flex gap-8">
            <Button
              variant="ghost"
              size="sm"
              className={`text-muted-foreground gap-2 ${
                hasLiked
                  ? "text-red-500 hover:text-red-600"
                  : "hover:text-red-500"
              }`}
              onClick={handleLike}
            >
              {hasLiked ? (
                <HeartIcon className="size-5 fill-current" />
              ) : (
                <HeartIcon className="size-5" />
              )}
              <span>{optimisticLikes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground gap-2"
            >
              <MessageCircleIcon className="size-5" />
              <span>{article.comments.length}</span>
            </Button>
          </div>
        </div>
        {fullContent && (
          <p className="font-light text-gray-400">
            {format(article.createdAt, "dd MMM yyyy")}
          </p>
        )}
        <h2>{article.title}</h2>
        <p className="font-light text-gray-400">by {article.author.name}</p>
      </div>
      <div
        className={`flex ${fullContent && "flex-col items-center"} gap-12 ${
          !fullContent && "h-60"
        }`}
      >
        <Image
          src={imageUrl}
          width={200}
          height={200}
          alt={article.image ? article.image : "No image"}
          style={{ objectFit: "contain" }}
        ></Image>
        <div className="flex flex-col justify-between">
          {fullContent ? (
            <article>{article.content}</article>
          ) : (
            <>
              <article className="line-clamp-8">
                {article.content.substring(0, 600)}
              </article>
              <ReadMore id={article.id}></ReadMore>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Article;
