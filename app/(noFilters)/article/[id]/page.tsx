import { getArticle } from "@/actions/article.actions";
import { getCurrentUser } from "@/actions/user.actions";
import Article from "@/components/Article";
import CommentSection from "@/components/CommentSection";
import { Toaster } from "@/components/ui/sonner";

const ArticlePage = async ({ params }: { params: Promise<{ id: number }> }) => {
  const { id } = await params;
  const user = await getCurrentUser({ withFullUser: true });
  const article = await getArticle(id);

  return (
    <div className="w-4xl mx-auto">
      {article && (
        <div className="flex flex-col gap-4">
          <Article
            article={article}
            userId={user?.id}
            fullContent={true}
          ></Article>
          <CommentSection
            articleId={id}
            userId={user?.id}
            userName={user?.name ?? undefined}
          ></CommentSection>
        </div>
      )}
      <Toaster></Toaster>
    </div>
  );
};

export default ArticlePage;
