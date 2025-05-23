import ArticleEdit from "@/components/admin/ArticleEdit";
import { getCurrentUser } from "@/actions/user.actions";

const NewArticlePage = async () => {
  const user = await getCurrentUser();
  if (user === null) return;

  return (
    <div className="p-8">
      <ArticleEdit userId={user.id}></ArticleEdit>
    </div>
  );
};

export default NewArticlePage;
