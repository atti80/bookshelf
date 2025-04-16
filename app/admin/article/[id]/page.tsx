import ArticleEdit from "@/components/admin/ArticleEdit";

const ArticleEditPage = async ({
  params,
}: {
  params: Promise<{ id: number }>;
}) => {
  const { id } = await params;

  return (
    <div>
      <ArticleEdit id={id}></ArticleEdit>
    </div>
  );
};

export default ArticleEditPage;
