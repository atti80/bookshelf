import { getArticles } from "@/actions/article.actions";
import Article from "@/components/Article";

export default async function Home() {
  const articles = await getArticles();

  return (
    <main className="bg-[url(@/public/images/bookshelf.jpg)] bg-contain bg-gray-500 bg-blend-multiply h-[2000px] min-w-full flex flex-col items-center">
      <h1>BOOKSHELF - share your reading experience!</h1>
      <div className="flex flex-col p-12 my-8 w-4xl">
        {articles.map((article) => (
          <Article key={article.id} article={article} userId={0}></Article>
        ))}
      </div>
    </main>
  );
}
