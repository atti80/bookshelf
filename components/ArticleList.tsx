import { getArticles } from "@/actions/article.actions";
import Article from "./Article";
import PaginationWrapper from "./Pagination";

type ArticleListProps = {
  userId: number | undefined;
  genreId: number;
  searchText: string;
  page: number;
};

const ARTICLES_PER_PAGE: number = parseInt(
  process.env.ARTICLES_PER_PAGE ?? "10"
);

const ArticleList = async ({
  userId,
  genreId,
  searchText,
  page,
}: ArticleListProps) => {
  const result = await getArticles(
    "published",
    genreId,
    searchText,
    ARTICLES_PER_PAGE,
    page ? (page - 1) * ARTICLES_PER_PAGE : 0
  );

  const articles = result.articles;
  const totalPages = Math.ceil(result.count / ARTICLES_PER_PAGE);

  return (
    <div className="px-8 col-start-2 col-span-4">
      {articles.length ? (
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-4 gap-8">
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
