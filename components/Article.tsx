"use client";

import { getArticles } from "@/actions/article.actions";
import Image from "next/image";
import Genres from "./Genres";
import ReadMore from "./ReadMore";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Articles = Awaited<ReturnType<typeof getArticles>>;
type Article = Articles[number];

const bucketUrl = process.env.NEXT_PUBLIC_AWS_BUCKET_URL;
const imageUrl = bucketUrl ? `${bucketUrl}/` : "/images/bookshelf.jpg";

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

  const container = useRef<HTMLElement | any>(null);
  const tl = useRef<GSAPTimeline | any>(gsap.timeline());
  const toggleHoverAnimation = () => {
    tl.current.reversed(!tl.current.reversed());
  };

  useGSAP(
    () => {
      const arrows = gsap.utils.toArray<HTMLElement>(".readmore-arrow");
      var docStyle = getComputedStyle(container.current);
      const primaryDark = docStyle.getPropertyValue("--color-primary-dark");
      const primary = docStyle.getPropertyValue("--color-primary");
      const primaryLight = docStyle.getPropertyValue("--color-primary-light");

      tl.current = gsap
        .timeline()
        .to("#readmore-text", {
          color: primaryLight,
          duration: 0.1,
        })
        .to(arrows[0], {
          opacity: 1,
          duration: 0.1,
        })
        .to(arrows[1], {
          opacity: 1,
          duration: 0.1,
        })
        .to(arrows[2], {
          opacity: 1,
          duration: 0.1,
        })
        .reverse();
    },
    { scope: container }
  );

  return (
    <Link href={`/article/${article.id}`}>
      <div
        className="bg-background my-4 p-12 flex flex-col items-center gap-8 rounded-md"
        onMouseEnter={toggleHoverAnimation}
        onMouseLeave={toggleHoverAnimation}
        ref={container}
      >
        <div className="flex flex-col w-full">
          <Genres genres={article.genres}></Genres>
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
            <ReadMore></ReadMore>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Article;
