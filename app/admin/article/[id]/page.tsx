import ArticleEdit from "@/components/admin/ArticleEdit";
import { getArticle } from "@/actions/article.actions";
import { getCurrentUser } from "@/actions/user.actions";

const ArticleEditPage = async ({
  params,
}: {
  params: Promise<{ id: number }>;
}) => {
  const { id } = await params;
  const article = await getArticle(id);
  const user = await getCurrentUser();

  if (user === null) return;

  return (
    <div>
      <ArticleEdit article={article} userId={user.id}></ArticleEdit>
    </div>
  );
};

export default ArticleEditPage;
