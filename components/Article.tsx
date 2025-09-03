"use client";

import { toggleLike } from "@/actions/like.actions";
import Image from "next/image";
import ReadMore from "./ReadMore";
import { useState, useRef } from "react";
import { HeartIcon } from "lucide-react";
import { Button } from "./ui/button";
import { ReadMoreHandle } from "./ReadMore";
import Link from "next/link";
import { Post } from "@/actions/wordpress.actions";
import { toast } from "sonner";

const Article = ({
  post: post,
  userId,
  translations,
}: {
  post: Post;
  userId: number | undefined;
  translations: Record<string, string>;
}) => {
  const readmoreRef = useRef<ReadMoreHandle>(null);
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(post.isLiked);

  const handleLike = async () => {
    if (isLiking) return;
    if (!userId) {
      toast.error(translations["sign_in_to_like"] || "Sign in to like");
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
    <div className="bg-background p-4 md:p-8 flex flex-col items-center rounded-md col-span-4 lg:col-span-3 xl:col-span-2">
      <div className="flex w-full gap-4 justify-between">
        <Link href={`/article/${post.id}`}>
          <h2
            dangerouslySetInnerHTML={{ __html: post.title }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          ></h2>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className={`text-muted-foreground gap-2
                 ${
                   hasLiked
                     ? "text-primary hover:text-primary-light hover:bg-transparent"
                     : "hover:text-primary hover:bg-transparent"
                 }`}
          disabled={isLiking}
          title={
            userId
              ? hasLiked
                ? translations["unlike"]
                : translations["like"]
              : translations["sign_in_to_like"]
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
      <Link href={`/article/${post.id}`}>
        <div
          className="flex flex-col w-full gap-8 mt-4"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className={"flex gap-8 h-56"}>
            {post.image && (
              <Image
                src={post.image}
                width={200}
                height={200}
                alt={post.image ? post.image : "No image"}
                style={{ objectFit: "contain" }}
                className="hidden lg:block"
              ></Image>
            )}
            <div className="flex flex-col justify-between h-full cursor-pointer">
              <article
                className="line-clamp-8"
                dangerouslySetInnerHTML={{ __html: post.excerpt }}
              ></article>
              <ReadMore
                ref={readmoreRef}
                readMoreText={translations["read_more"] || "Read more"}
              ></ReadMore>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Article;
