import Picture from "./picture";

type Author = {
  id: string;
  slug: string;
  name: string;
  biography: string;
  picture: Picture;
};

export default Author;
