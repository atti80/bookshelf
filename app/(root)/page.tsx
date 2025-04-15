import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import UserCard from "@/components/UserCard";
import ArticleList from "@/components/ArticleList";
import { getCurrentUser } from "@/actions/user.actions";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default async function Home() {
  const user = await getCurrentUser({ withFullUser: true });
  return (
    <div className="grid grid-cols-5 justify-items-center items-start">
      <UserCard user={user}></UserCard>
      <ArticleList userId={user?.id}></ArticleList>
    </div>
  );
}
