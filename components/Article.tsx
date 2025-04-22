"use client";

import { getArticles, toggleLike } from "@/actions/article.actions";
import Image from "next/image";
import Genres from "./Genres";
import ReadMore from "./ReadMore";
import { useEffect, useState, useRef } from "react";
import { HeartIcon, MessageCircleIcon } from "lucide-react";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { ReadMoreHandle } from "./ReadMore";
import Link from "next/link";

type Articles = Awaited<ReturnType<typeof getArticles>>;
type Article = Articles["articles"][number];

const BUCKET_URL = process.env.NEXT_PUBLIC_AWS_BUCKET_URL;

const Article = ({
  article,
  userId,
  fullContent = false,
}: {
  article: Article;
  userId: number | undefined;
  fullContent?: boolean;
}) => {
  const readmoreRef = useRef<ReadMoreHandle>(null);
  const [imageUrl, setImageUrl] = useState("/images/bookshelf.jpg");
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(
    article.likes.some((like) => like.userId === userId)
  );
  const [optimisticLikes, setOptmisticLikes] = useState(article.likes.length);

  useEffect(() => {
    if (BUCKET_URL) setImageUrl(`${BUCKET_URL}/${article.image}`);
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

  const handleMouseEnter = () => {
    if (readmoreRef.current) {
      readmoreRef.current.startAnimation();
    }
  };

  const handleMouseLeave = () => {
    if (readmoreRef.current) {
      readmoreRef.current.reverseAnimation();
    }
  };

  return (
    <div className="bg-background p-8 flex flex-col items-center gap-8 rounded-md col-span-2">
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between mb-4">
          <Genres genres={article.genres}></Genres>
          <div className="flex gap-8">
            <Button
              variant="ghost"
              size="sm"
              className={`text-muted-foreground gap-2 ${
                hasLiked
                  ? "text-primary hover:text-primary-light hover:bg-transparent"
                  : "hover:text-primary hover:bg-transparent"
              }`}
              disabled={isLiking}
              title={
                userId ? (hasLiked ? "Unlike" : "Like") : "Sign in to like"
              }
              onClick={handleLike}
            >
              {hasLiked ? (
                <HeartIcon className="size-8 fill-current" />
              ) : (
                <HeartIcon className="size-6 mr-1" />
              )}
              {/* <span>{optimisticLikes}</span> */}
            </Button>
          </div>
        </div>
        {fullContent && article.publishedAt && (
          <p className="font-light text-gray-400">
            {format(article.publishedAt, "dd MMM yyyy")}
          </p>
        )}
        <h2>{article.title}</h2>
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
            <article className="whitespace-pre-line">{article.content}</article>
          ) : (
            <Link href={`/article/${article.id}`}>
              <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="flex flex-col gap-4 h-full cursor-pointer"
              >
                <article className="line-clamp-8">
                  {article.content.substring(0, 600)}
                </article>
                <ReadMore ref={readmoreRef}></ReadMore>
              </div>
            </Link>
          )}
        </div>
      </div>
      {fullContent && (
        <p className="font-light text-gray-400 self-end">
          by {article.author.name}
        </p>
      )}
    </div>
  );
};

export default Article;
