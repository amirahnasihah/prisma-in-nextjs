import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import Link from "next/link";

const PostPage = async ({ params }: { params: { slug: string } }) => {
  // db query to get post by id -> [id]
  // get post by id with passing props called the params -> cuid is string
  const post = await prisma.post.findUnique({
    where: {
      slug: params.slug,
    },
  });

  return (
    <main className="flex flex-col items-center justify-center gap-y-5 pt-24 text-center">
      <h1 className="text-3xl font-semibold">{post?.title}</h1>
      <p>{post?.content}</p>
      <p>
        <strong>Updated At:</strong> {post?.updatedAt?.toLocaleString()}
      </p>
      <Link href={"/posts"}>
        <Button>All posts</Button>
      </Link>
    </main>
  );
};

export default PostPage;
