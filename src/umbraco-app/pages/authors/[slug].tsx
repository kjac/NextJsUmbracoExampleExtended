import {getAllAuthorSlugs, getAuthorAndAuthorPosts} from "../../lib/api";
import ErrorPage from "next/error";
import Post from "../../types/post";
import Author from "../../types/author";
import Image from "next/image";
import BodyStyles from "../../components/post-body.module.css";
import Container from "../../components/container";
import Head from "next/head";
import Header from "../../components/header";
import Layout from "../../components/layout";
import PostPreview from "../../components/post-preview";
import SectionSeparator from "../../components/section-separator";

export default function AuthorDetails({author, posts, preview}: {
  author: Author;
  posts: Post[];
  preview: boolean;
}) {
  if (!author) {
    return <ErrorPage statusCode={404} />;
  }

  return <Layout preview={preview}>
    <Container>
      <Header />
      <article className="max-w-2xl mx-auto">
        <Head>
          <title>
            {author.name} | Next.js Blog Example
          </title>
          <meta property="og:image" content={author.picture.url}/>
        </Head>
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center md:text-left">
          {author.name}
        </h1>
        <div className="mb-8 md:mb-16 sm:mx-0">
          <Image src={author.picture.url} alt={author.name} width={400} height={400} className="shadow-small"/>
        </div>
        <div className={BodyStyles.content} dangerouslySetInnerHTML={{__html: author.biography}} />
      </article>
      
      {posts && posts.length > 0 && (
        <>
          <SectionSeparator/>
          <section>
            <h2 className="mb-8 text-6xl md:text-7xl font-bold tracking-tighter leading-tight">
              Stories by {author.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 mb-32">
              {posts.map((post) =>
                <PostPreview key={post.slug} title={post.title} coverImage={post.coverImage} date={post.date} slug={post.slug} excerpt={post.excerpt} author={author} />
              )}
            </div>
          </section>
        </>
      )}
    </Container>
  </Layout>;
}

export async function getStaticPaths({preview}: { preview: boolean }) {
  const slugs = await getAllAuthorSlugs(preview);
  return {
    paths: slugs.map((slug) => ({
      params: {
        slug: slug
      }
    })),
    fallback: false
  };
}

export async function getStaticProps({params, preview}: {
  params: {
    slug: string
  };
  preview: boolean;
}) {
  const authorAndAuthorPosts = await getAuthorAndAuthorPosts(params.slug, preview);

  return {
    props: {
      author: authorAndAuthorPosts.author,
      posts: authorAndAuthorPosts.posts,
      preview: preview || null
    }
  };
}
