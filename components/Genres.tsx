import { getArticles } from "@/actions/article.actions";
import Link from "next/link";

type Articles = Awaited<ReturnType<typeof getArticles>>;
type Genre = Articles["articles"][number]["genres"][number];

const Genres = ({ genres }: { genres: Genre[] }) => {
  return (
    <div className="flex">
      {genres.map((genre) => (
        <Link href={`/?genre=${genre.genreId}`} key={genre.genreId}>
          <div className="bg-primary-light rounded-md px-4 py-1 text-sm text-background mr-2">
            {genre.genre.name}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Genres;
