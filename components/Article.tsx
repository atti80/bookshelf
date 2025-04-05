import { getArticles } from "@/actions/article.actions";
import { formatDistanceToNow } from "date-fns";

type Articles = Awaited<ReturnType<typeof getArticles>>;
type Article = Articles[number];

const Article = ({
  article,
  userId,
}: {
  article: Article;
  userId: number | null;
}) => {
  return (
    <div className="bg-background my-4 p-4">
      <h2>{article.title}</h2>
      <p className="font-light text-gray-400">
        {formatDistanceToNow(article.publishedAt ?? "")}
      </p>
      {article.likes.length} {article.content}
    </div>
  );
};

export default Article;
