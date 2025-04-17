import { getArticles } from "@/actions/article.actions";
import AdminListItem from "./AdminListItem";
import { getCurrentUser } from "@/actions/user.actions";

const AdminList = async () => {
  const articles = (await getArticles()).articles;
  const user = await getCurrentUser();

  if (user === null) return;

  return (
    <div className="w-4xl flex flex-col gap-4 p-8 col-start-2 col-span-3 justify-self-center">
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
