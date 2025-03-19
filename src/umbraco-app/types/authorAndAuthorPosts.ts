import Post from "./post";
import Author from "./author";

type AuthorAndAuthorPosts = {
  author: Author;
  posts: Post[];
};

export default AuthorAndAuthorPosts;
