import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import UserCard from "@/components/UserCard";
import ArticleList from "@/components/ArticleList";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default async function Home() {
  return (
    <main className="bg-[url(/images/bookshelf.jpg)] bg-contain bg-gray-500 bg-blend-multiply py-8 min-h-screen min-w-full grid grid-cols-5 justify-items-center items-start">
      <UserCard></UserCard>
      <ArticleList></ArticleList>
    </main>
  );
}
