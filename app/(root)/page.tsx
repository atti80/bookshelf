import { getArticles } from "@/actions/article.actions";
import Article from "@/components/Article";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import UserCard from "@/components/UserCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default async function Home() {
  const articles = await getArticles();

  return (
    <main className="bg-[url(/images/bookshelf.jpg)] bg-contain bg-gray-500 bg-blend-multiply py-8 min-h-screen min-w-full grid grid-cols-5 justify-items-center items-start">
      <UserCard></UserCard>
      <div className="flex flex-col gap-8 w-3xl col-start-2 col-span-3">
        {articles.map((article) => (
          <Article key={article.id} article={article} userId={0}></Article>
        ))}
      </div>
    </main>
  );
}
