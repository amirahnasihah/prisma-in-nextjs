// server component
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import Link from "next/link";

const PostsPage = async () => {
  const posts = await prisma.post.findMany({});

  return (
    <main className="flex flex-col items-center justify-center gap-y-5 pt-24 text-center">
      <h1 className="text-3xl font-semibold">All Posts (0)</h1>

      <ul className="border-t border-b border-black/10 py-5 leading-8">
        {posts.map((post) => (
          <li key={post.id} className="flex items-center justify-between px-5">
            {/* 1. http://localhost:3000/posts/cm0ta66gh0000syf3y0tyj5sc */}
            {/* 2. now, change the href from {`/posts/${post.id}`} to slug {`/posts/${post.slug}`} -> but get strange string formatting = so create separate field in schema prisma called slug and @unique */}
            <Link className="text-blue-600" href={`/posts/${post.slug}`}>
              {post.title}
            </Link>
            <span className="text-black/50 ml-2">
              {new Date(post.createdAt).toLocaleString("en-MY", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </span>
          </li>
        ))}
      </ul>
      <Link href={"/"}>
        <Button>Home</Button>
      </Link>
    </main>
  );
};

export default PostsPage;
