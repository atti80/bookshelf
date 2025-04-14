import { getArticle } from "@/actions/article.actions";
import Article from "@/components/Article";

const ArticlePage = async ({ params }: { params: Promise<{ id: number }> }) => {
  const { id } = await params;
  const article = await getArticle(id);

  return (
    <div className="w-4xl mx-auto">
      {article && (
        <Article article={article} userId={0} fullContent={true}></Article>
      )}
    </div>
  );
};

export default ArticlePage;
