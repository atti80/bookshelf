import { getArticle } from "@/actions/article.actions";
import { format } from "date-fns";

type Article = Awaited<ReturnType<typeof getArticle>>;

const ArticlePage = async ({ params }: { params: Promise<{ id: number }> }) => {
  const { id } = await params;
  const article: Article = await getArticle(id);

  return (
    <div>
      {`Article no. ${id}`}
      {article && (
        <div>
          <h1>{article.title}</h1>
          <p>{article.content}</p>
          <p>Author: {article.author.name}</p>
          <p>
            Published at:{" "}
            {format(new Date(article.publishedAt as Date), "dd MMM yyyy")}
          </p>
        </div>
      )}
    </div>
  );
};

export default ArticlePage;
