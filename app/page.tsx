import UserCard from "@/components/UserCard";
import ArticleList from "@/components/ArticleList";
import CategorySelect from "@/components/CategorySelect";
import { fetchCategories, fetchPosts } from "@/actions/wordpress.actions";
import { getCachedTranslations } from "@/actions/translation.helper";
import PageViewCounter from "@/components/PageViewCounter";
import { incrementPageViews } from "@/actions/pageviews.action";
import { getLikesByUserId } from "@/actions/like.actions";
import { getCurrentUser } from "@/actions/user.actions";
import Footer from "@/components/Footer";
import NavbarWrapper from "@/components/NavbarWrapper";
import { redirect } from "next/navigation";
import { updateUserSessionExpiration } from "@/lib/session";
import { cookies } from "next/headers";

const ARTICLES_PER_PAGE: number = parseInt(
  process.env.ARTICLES_PER_PAGE ?? "10"
);

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
  const categories = await fetchCategories();

  const pageViews = await incrementPageViews(0);
  const user = await getCurrentUser({ withFullUser: true });
  const likes = user ? await getLikesByUserId(user.id) : [];

  if (favourites && !user) {
    redirect("/sign-in");
  }

  if (user) {
    const cookieStore = await cookies();
    updateUserSessionExpiration(cookieStore);
  }

  const postsResponse = await fetchPosts(
    page,
    ARTICLES_PER_PAGE,
    categoryId,
    tagId,
    searchText,
    favourites ? likes.map((like) => like.articleId) : undefined
  );
  postsResponse.posts.forEach((post) => {
    post.isLiked = likes.some((like) => like.articleId === post.id);
  });

  return (
    <div className="h-screen flex flex-col">
      <NavbarWrapper user={user}></NavbarWrapper>
      <main className="py-8 min-w-full grow">
        <div className="flex flex-col max-md:flex-col-reverse max-md:gap-2 md:grid md:grid-cols-5  justify-items-center items-start mt-16 md:mt-42">
          <div className="flex flex-col gap-4 w-full items-center">
            <div className="max-md:hidden flex flex-col items-center gap-2">
              <UserCard user={user} translations={translations}></UserCard>
              <CategorySelect
                categories={categories}
                categoryText={translations["categories"]}
                allGenresText={translations["all_genres"]}
              ></CategorySelect>
            </div>
            <PageViewCounter
              text={translations["total_page_views"]}
              count={pageViews}
            ></PageViewCounter>
          </div>
          <ArticleList
            userId={user?.id}
            posts={postsResponse.posts}
            postsPerPage={ARTICLES_PER_PAGE}
            postsTotal={postsResponse.count}
            translations={translations}
          ></ArticleList>
        </div>
      </main>
      <Footer></Footer>
    </div>
  );
}
