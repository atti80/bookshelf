import { getArticles } from "@/actions/article.actions";

type Articles = Awaited<ReturnType<typeof getArticles>>;
type Genre = Articles["articles"][number]["genres"][number];

const Genres = ({ genres }: { genres: Genre[] }) => {
  return (
    <div className="flex">
      {genres.map((genre) => (
        <div
          key={genre.genreId}
          className="bg-primary-light rounded-md px-4 py-1 text-sm text-background mr-2"
        >
          {genre.genre.name}
        </div>
      ))}
    </div>
  );
};

export default Genres;
