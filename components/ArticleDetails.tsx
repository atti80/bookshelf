"use client";

import { toggleLike } from "@/actions/like.actions";
import Genres from "./Genres";
import { useState } from "react";
import { HeartIcon } from "lucide-react";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { hu } from "date-fns/locale";
import Link from "next/link";
import { PostDetails } from "@/actions/wordpress.actions";
import { toast } from "sonner";

const ArticleDetails = ({
  post: post,
  userId,
  signInMessage,
}: {
  post: PostDetails;
  userId: number | undefined;
  fullContent?: boolean;
  signInMessage?: string;
}) => {
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(post.isLiked);

  const handleLike = async () => {
    if (isLiking) return;
    if (!userId) {
      toast.error(signInMessage || "Sign in to like");
      return;
    }

    try {
      setIsLiking(true);
      setHasLiked((prev) => !prev);
      await toggleLike(userId, post.id);
    } catch (error) {
      setHasLiked(post.isLiked);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="bg-background p-4 md:p-8 flex flex-col items-center gap-8 rounded-md col-span-4 lg:col-span-3 xl:col-span-2">
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between mb-4">
          <Genres genres={post.categories}></Genres>
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
            </Button>
          </div>
        </div>
        {post.publishedAt && (
          <p className="font-light text-gray-400 mt-4 mb-2">
            {format(post.publishedAt, "yyyy. MMMM dd.", { locale: hu })} |
            {` Szerző: ${post.author}`}
          </p>
        )}
        <h2 dangerouslySetInnerHTML={{ __html: post.title }}></h2>
      </div>
      <div className={"flex flex-col items-center max-md:text-sm/4 gap-8"}>
        <article
          className="whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></article>
      </div>
      <div>
        {post.tags.map((tag) => (
          <Link href={`/?tag=${tag.id}`} key={tag.id} className="mr-2">
            <span key={tag.id}>{tag.name} </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ArticleDetails;
