import Image from "next/image";
import Author from "../types/author";
import Link from "next/link";

type Props = {
  author: Author;
};

export default function Avatar({ author }: Props) {
  const name: string = author?.name;

  return (
    <Link href={`/authors/${author.slug}`} className="hover:underline">
      <div className="flex items-center">
        <div className="w-12 h-12 relative mr-4">
          <Image
            src={author.picture.url}
            layout="fill"
            className="rounded-full"
            alt={name}
          />
        </div>
        <div className="text-xl font-bold">{name}</div>
      </div>
    </Link>
  );
}
