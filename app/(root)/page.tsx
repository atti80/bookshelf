import { getArticles } from "@/actions/article.actions";
import Article from "@/components/Article";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default async function Home() {
  const articles = await getArticles();

  return (
    <main className="bg-[url(/images/bookshelf.jpg)] bg-contain bg-gray-500 bg-blend-multiply min-h-screen min-w-full flex flex-col items-center">
      <div className="flex flex-col p-12 my-8 w-4xl">
        {articles.map((article) => (
          <Article key={article.id} article={article} userId={0}></Article>
        ))}
      </div>
    </main>
  );
}
