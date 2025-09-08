"use client";

import Article from "./Article";
import PaginationWrapper from "./Pagination";
import { Post } from "@/actions/wordpress.actions";

type ArticleListProps = {
  userId: number | undefined;
  posts: Post[];
  postsTotal: number;
  postsPerPage: number;
  translations: Record<string, string>;
};

const ArticleList = ({
  userId,
  posts,
  postsTotal,
  postsPerPage,
  translations,
}: ArticleListProps) => {
  const totalPages = Math.ceil(postsTotal / postsPerPage);

  return (
    <div className="col-start-2 col-span-4 ">
      {posts.length ? (
        <div className="flex flex-col items-center px-1 xl:px-2 2xl:px-4">
          <div className="flex flex-col xl:grid xl:grid-cols-2 gap-4 2xl:gap-8">
            {posts.map((post: Post) => (
              <Article
                key={post.id}
                post={post}
                userId={userId}
                translations={translations}
              ></Article>
            ))}
          </div>
          <PaginationWrapper totalPages={totalPages}></PaginationWrapper>
        </div>
      ) : (
        <h2 className="text-foreground mt-8">{translations["no_articles"]}</h2>
      )}
    </div>
  );
};

export default ArticleList;
