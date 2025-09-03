import Article from "./Article";
import PaginationWrapper from "./Pagination";
import { redirect } from "next/navigation";
import { getUserFromSession, updateUserSessionExpiration } from "@/lib/session";
import { cookies } from "next/headers";
import { Post, fetchPosts } from "@/actions/wordpress.actions";
import { getLikesByUserId } from "@/actions/like.actions";

type ArticleListProps = {
  userId: number | undefined;
  categoryId: number | undefined;
  tagId: number | undefined;
  searchText: string;
  page: number;
  favourites: boolean;
  translations: Record<string, string>;
};

const ARTICLES_PER_PAGE: number = parseInt(
  process.env.ARTICLES_PER_PAGE ?? "10"
);

const ArticleList = async ({
  userId,
  categoryId,
  tagId,
  searchText,
  page,
  favourites,
  translations,
}: ArticleListProps) => {
  if (favourites) {
    const cookieStore = await cookies();
    const user = await getUserFromSession(cookieStore);

    if (!user) {
      redirect("/sign-in");
    }

    updateUserSessionExpiration(cookieStore);
  }

  const likes = userId ? await getLikesByUserId(userId) : [];
  const postsResponse = await fetchPosts(
    page,
    ARTICLES_PER_PAGE,
    categoryId,
    tagId,
    searchText,
    favourites ? likes.map((like) => like.articleId) : undefined
  );

  postsResponse.posts.forEach((post) => {
    post.isLiked = likes.some((like) => like.articleId === post.id);
  });

  const totalPages = Math.ceil(postsResponse.count / ARTICLES_PER_PAGE);

  return (
    <div className="col-start-2 col-span-4 lg:col-span-6 xl:col-span-4">
      {postsResponse.posts.length ? (
        <div className="flex flex-col items-center px-1 xl:px-2 2xl:px-4">
          <div className="grid grid-cols-4 lg:max-xl:grid-cols-6 gap-4 2xl:gap-8">
            {postsResponse.posts.map((post: Post) => (
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
        <h2>No articles found</h2>
      )}
    </div>
  );
};

export default ArticleList;
