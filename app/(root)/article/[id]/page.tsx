const ArticlePage = async ({ params }: { params: Promise<{ id: number }> }) => {
  const { id } = await params;
  return <div>{`Article no. ${id}`}</div>;
};

export default ArticlePage;
