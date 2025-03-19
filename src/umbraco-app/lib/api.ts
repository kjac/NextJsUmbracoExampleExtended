import Post from "../types/post";
import Author from "../types/author";
import PostAndMorePosts from "../types/postAndMorePosts";
import AuthorAndAuthorPosts from "../types/authorAndAuthorPosts";

const UMBRACO_SERVER_URL = process.env.UMBRACO_SERVER_URL;
const UMBRACO_DELIVERY_API_KEY = process.env.UMBRACO_DELIVERY_API_KEY;
const UMBRACO_API_URL = `${UMBRACO_SERVER_URL}/umbraco/delivery/api/v2/content`;

const performFetch = async (url: string, options: RequestInit) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    const message = `Could not fetch data for URL: ${url} - response status was: ${response.status}`;
    throw new Error(message);
  }

  return await response.json();
};

const fetchSingle = async (slug: string, startItem: string, preview: boolean) =>
  await performFetch(`${UMBRACO_API_URL}/item/${slug}`, {
    method: "GET",
    headers: {
      "Start-Item": startItem,
      "Api-Key": UMBRACO_DELIVERY_API_KEY,
      Preview: preview ? "true" : "false",
    },
  });

const fetchMultiple = async (
  query: string,
  startItem: string,
  preview: boolean,
) =>
  await performFetch(`${UMBRACO_API_URL}/?${query}`, {
    method: "GET",
    headers: {
      "Start-Item": startItem,
      "Api-Key": UMBRACO_DELIVERY_API_KEY,
      Preview: preview ? "true" : "false",
    },
  });

const extractSlug = (item: any): string => item.route.path;

const extractAuthor = (author: any): Author => {
  return {
    id: author.id,
    slug: extractAuthorSlug(author),
    name: author.name,
    biography: author.properties.biography?.markup ?? '',
    picture: author.properties.picture 
        ? {
          url: `${UMBRACO_SERVER_URL}${author.properties.picture[0].url}`,
        }
        : {
          url: ""
        }
  };
};

const extractPost = (post: any): Post => {
  // NOTE: author is an expanded property on the post
  const author = extractAuthor(post.properties.author);
  return {
    id: post.id,
    slug: extractSlug(post),
    title: post.name,
    coverImage: {
      url: `${UMBRACO_SERVER_URL}${post.properties.coverImage[0].url}`,
    },
    date: post.updateDate,
    author: author,
    excerpt: post.properties.excerpt,
    content: post.properties.content.markup,
    tags: post.properties.tags,
  };
};

const fetchPost = async (slug: string, preview: boolean) =>
  await fetchSingle(`${slug}?expand=properties[author]`, "posts", preview);

const fetchPosts = async (
  expandAuthor: boolean,
  numberOfPosts: number,
  preview: boolean,
  authorId?: string | null
) => {
  const expand = expandAuthor ? "properties[author]" : "";
  const take = numberOfPosts ?? 10;
  const filter = authorId ? `author:${authorId}` : '';
  return await fetchMultiple(
    `fetch=children:/&filter=${filter}&expand=${expand}&sort=updateDate:desc&take=${take}`,
    "posts",
    preview,
  );
};

export const getAllPostSlugs = async (preview: boolean): Promise<string[]> => {
  const json = await fetchPosts(false, 100, preview);
  return json.items.map((post) => extractSlug(post));
};

export const getAllPostsForHome = async (preview: boolean): Promise<Post[]> => {
  const json = await fetchPosts(true, 10, preview);
  return json.items.map(extractPost);
};

export const getPostAndMorePosts = async (
  slug: string,
  preview: boolean,
): Promise<PostAndMorePosts> => {
  const postJson = await fetchPost(slug, preview);
  const post = extractPost(postJson);
  const morePostsJson = await fetchPosts(true, 3, preview);
  const morePosts = morePostsJson.items.map(extractPost);
  return {
    post: post,
    morePosts: morePosts.filter((p) => p.id !== post.id).slice(0, 2),
  };
};

// NOTE: this should not be here; extractSlug should trim the slashes. unfortunately that breaks the original
//       example code, so in order to minimize the number of changes, this will have to do.
const extractAuthorSlug = (item: any): string => item.route.path.replace(/^\/|\/$/g, '');

export const getAllAuthorSlugs = async (preview: boolean): Promise<string[]> => {
  const json = await fetchMultiple(
      `fetch=children:/&sort=updateDate:desc&take=100`,
      "authors",
      preview,
  )
  return json.items.map((author) => extractAuthorSlug(author));
};

export const getAuthorAndAuthorPosts = async (
    slug: string,
    preview: boolean,
): Promise<AuthorAndAuthorPosts> => {
  const authorJson = await fetchSingle(slug, "authors", preview);
  const author = extractAuthor(authorJson);
  const authorPostsJson = await fetchPosts(false, 10, preview, author.id);
  const authorPosts = authorPostsJson.items.map(extractPost);
  return {
    author: author,
    posts: authorPosts,
  };
};
