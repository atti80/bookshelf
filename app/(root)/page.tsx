import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import UserCard from "@/components/UserCard";
import ArticleList from "@/components/ArticleList";
import { getCurrentUser } from "@/actions/user.actions";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const genreId = params["genre"] ? parseInt(params["genre"] as string) : 0;
  const searchText = params["search"] as string;
  const page = params["page"] ? parseInt(params["page"] as string) : 1;
  const user = await getCurrentUser({ withFullUser: true });

  console.log(genreId, searchText, page);

  return (
    <div className="grid grid-cols-5 justify-items-center items-start">
      <UserCard user={user}></UserCard>
      <ArticleList
        userId={user?.id}
        genreId={genreId}
        searchText={searchText}
        page={page}
      ></ArticleList>
    </div>
  );
}
