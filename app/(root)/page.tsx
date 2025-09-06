import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import UserCard from "@/components/UserCard";
import ArticleList from "@/components/ArticleList";
import { getCurrentUser } from "@/actions/user.actions";
import CategorySelect from "@/components/CategorySelect";
import { fetchCategories } from "@/actions/wordpress.actions";
import { getCachedTranslations } from "@/actions/translation.helper";
import PageViewCounter from "@/components/PageViewCounter";
import { incrementPageViews } from "@/actions/pageviews.action";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

const translations = await getCachedTranslations([
  "read_more",
  "sign_in_to_like",
  "like",
  "unlike",
  "sign_in",
  "sign_out",
  "register",
  "guest",
  "last_login",
  "favorites",
  "categories",
  "all_genres",
  "no_articles",
  "change_password",
  "total_page_views",
]);

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const categoryId = params["category"]
    ? parseInt(params["category"] as string)
    : 0;
  const tagId = params["tag"] ? parseInt(params["tag"] as string) : 0;
  const searchText = params["search"] as string;
  const page = params["page"] ? parseInt(params["page"] as string) : 1;
  const favourites = params["favourites"] === "true";
  const user = await getCurrentUser({ withFullUser: true });
  const categories = await fetchCategories();

  const pageViews = await incrementPageViews(0);

  return (
    <div className="flex flex-col max-md:gap-2 md:grid md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-5 justify-items-center items-start">
      <div className="flex flex-col gap-4 w-full items-center">
        <UserCard user={user} translations={translations}></UserCard>
        <CategorySelect
          categories={categories}
          categoryText={translations["categories"]}
          allGenresText={translations["all_genres"]}
        ></CategorySelect>
        <PageViewCounter
          text={translations["total_page_views"]}
          count={pageViews}
        ></PageViewCounter>
      </div>
      <ArticleList
        userId={user?.id}
        categoryId={categoryId}
        tagId={tagId}
        searchText={searchText}
        page={page}
        favourites={favourites}
        translations={translations}
      ></ArticleList>
    </div>
  );
}
