import { getArticles } from "@/actions/article.actions";
import AdminListItem from "./AdminListItem";
import { getCurrentUser } from "@/actions/user.actions";

const AdminList = async () => {
  const articles = (await getArticles()).articles;
  const user = await getCurrentUser();

  if (user === null) return;

  return (
    <div className="flex flex-col gap-4 px-4 py-8 max-w-4xl  lg:p-8 lg:col-start-2 lg:col-span-3 lg:justify-self-center">
      {articles.map((article) => (
        <AdminListItem
          key={article.id}
          article={article}
          userId={user.id}
        ></AdminListItem>
      ))}
    </div>
  );
};

export default AdminList;
