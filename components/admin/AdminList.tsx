import { getArticles } from "@/actions/article.actions";
import AdminListItem from "./AdminListItem";
import Link from "next/link";
import { Button } from "../ui/button";

const AdminList = async () => {
  const articles = await getArticles();

  return (
    <div className="relative">
      <div>
        <Button asChild>
          <Link href="/admin/article/new">New</Link>
        </Button>
        <Button asChild>
          <Link href="/">Exit</Link>
        </Button>
      </div>
      <div className="w-4xl flex flex-col gap-4 p-8 mx-auto">
        {articles.map((article) => (
          <AdminListItem key={article.id} article={article}></AdminListItem>
        ))}
      </div>
    </div>
  );
};

export default AdminList;
