import Link from "next/link";

const Genres = ({ genres }: { genres: { id: number; name: string }[] }) => {
  return (
    <div className="flex">
      {genres.map((genre) => (
        <Link href={`/?category=${genre.id}`} key={genre.id}>
          <div className="bg-primary-light rounded-md px-4 py-1 text-sm text-background mr-2">
            {genre.name}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Genres;
