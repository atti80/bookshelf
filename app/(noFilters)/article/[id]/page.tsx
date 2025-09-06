import { incrementPageViews } from "@/actions/pageviews.action";
import { getCachedTranslations } from "@/actions/translation.helper";
import { getCurrentUser } from "@/actions/user.actions";
import { fetchPostDetails } from "@/actions/wordpress.actions";
import ArticleDetails from "@/components/ArticleDetails";
import CommentSection from "@/components/CommentSection";

const translations = await getCachedTranslations([
  "sign_in_to_comment",
  "sign_in_to_like",
  "no_comments",
  "comments",
  "comment",
  "delete",
  "delete_confirm",
  "cancel",
  "submit",
  "comment_placeholder",
  "sign_in",
]);

const ArticlePage = async ({ params }: { params: Promise<{ id: number }> }) => {
  const { id } = await params;
  const user = await getCurrentUser({ withFullUser: true });
  const post = await fetchPostDetails(id);
  post.isLiked = user
    ? user.likes.some((like) => like.articleId === post.id)
    : false;

  await incrementPageViews(id);

  return (
    <div className="max-w-4xl mx-auto">
      {post && (
        <div className="flex flex-col gap-4 px-4">
          <ArticleDetails
            post={post}
            userId={user?.id}
            fullContent={true}
            signInMessage={translations["sign_in_to_like"]}
          ></ArticleDetails>
          <CommentSection
            articleId={id}
            userId={user?.id}
            userName={user?.name ?? undefined}
            translations={translations}
          ></CommentSection>
        </div>
      )}
    </div>
  );
};

export default ArticlePage;
