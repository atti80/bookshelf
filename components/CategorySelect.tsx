import Link from "next/link";

const CategorySelect = ({
  categories,
  categoryText,
  allGenresText,
}: {
  categories: { id: number; name: string }[];
  categoryText: string;
  allGenresText: string;
}) => {
  return (
    <div className="bg-background flex flex-col gap-2 p-4 rounded-md w-[90%] xl:w-[80%]">
      <h2 className="font-bold text-lg text-center">{categoryText}</h2>
      <hr className="bg-primary-dark"></hr>
      <Link href={`/`} key={0}>
        <span className="mb-2">{allGenresText}</span>
      </Link>
      {categories.map((category) => (
        <Link href={`/?category=${category.id}`} key={category.id}>
          <span className="mb-2">{category.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default CategorySelect;
