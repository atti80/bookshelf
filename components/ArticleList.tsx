import { getArticles } from "@/actions/article.actions";
import Article from "./Article";
import PaginationWrapper from "./Pagination";
import { redirect } from "next/navigation";
import { getUserFromSession } from "@/lib/session";
import { cookies } from "next/headers";

type ArticleListProps = {
  userId: number | undefined;
  genreId: number;
  searchText: string;
  page: number;
  favourites: boolean;
};

const ARTICLES_PER_PAGE: number = parseInt(
  process.env.ARTICLES_PER_PAGE ?? "10"
);

const ArticleList = async ({
  userId,
  genreId,
  searchText,
  page,
  favourites,
}: ArticleListProps) => {
  if (favourites) {
    const user = await getUserFromSession(await cookies());

    if (!user) {
      redirect("/sign-in");
    }
  }

  const result = await getArticles(
    "published",
    genreId,
    searchText,
    ARTICLES_PER_PAGE,
    page ? (page - 1) * ARTICLES_PER_PAGE : 0,
    favourites ? userId : undefined
  );

  const articles = result.articles;
  const totalPages = Math.ceil(result.count / ARTICLES_PER_PAGE);

  return (
    <div className="col-start-2 col-span-4 lg:col-span-6 xl:col-span-4">
      {articles.length ? (
        <div className="flex flex-col items-center px-1 xl:px-2 2xl:px-4">
          <div className="grid grid-cols-4 lg:max-xl:grid-cols-6 gap-4 2xl:gap-8">
            {articles.map((article) => (
              <Article
                key={article.id}
                article={article}
                userId={userId}
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
