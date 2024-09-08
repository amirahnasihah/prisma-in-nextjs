# Prisma in Nextjs

Prisma is a database toolkit and an Object-Relational Mapping (ORM) layer that sits on top of a database. It provides a modern and type-safe way to interact with databases, abstracting away the differences between different database systems.

> fav way to work with database

## Prisma Client

In the real world we dont really know what you're doing in the beginning with the model of database. so, whenever you change a schema in the beginning, you may want to run this command to push the changes made in your schema to the actual database.

```ts
npx prisma db push
```

## Prisma Studio

Prisma Studio is an auto-generated UI for your database. It allows you to view and edit data in your database.

```ts
npx prisma studio
```

## Instantiating Prisma Client with Nextjs

> https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices

```ts
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
```

## GET All and Single

### all posts with id

```ts
// server component
import prisma from "@/lib/db";
import Link from "next/link";

const PostsPage = async () => {
  const posts = await prisma.post.findMany();

  return (
    <main className="flex flex-col items-center justify-center gap-y-5 pt-24 text-center">
      <h1 className="text-3xl font-semibold">All Posts (0)</h1>

      <ul className="border-t border-b border-black/10 py-5 leading-8">
        {posts.map((post) => (
          <li key={post.id} className="flex items-center justify-between px-5">
            {/* 1. http://localhost:3000/posts/cm0ta66gh0000syf3y0tyj5sc */}
            {/* 2. now, change the href to title -> but get strange string formatting = so create separate field in schema prisma called slug and @unique */}
            <Link className="text-blue-600" href={`/posts/${post.id}`}>
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
    </main>
  );
};

export default PostsPage;
```

### post by id

/posts/[id]/page.tsx:

```ts
import prisma from "@/lib/db";

const PostPage = async ({ params }: { params: { id: string } }) => {
  // db query to get post by id -> [id]
  // get post by id with passing props called the params -> cuid is string
  const post = await prisma.post.findUnique({
    where: {
      id: params.id,
    },
  });

  return (
    <main className="flex flex-col items-center justify-center gap-y-5 pt-24 text-center">
      <h1 className="text-3xl font-semibold">{post?.title}</h1>
      <p>{post?.content}</p>
      <p>
        <strong>Updated At:</strong> {post?.updatedAt?.toLocaleString()}
      </p>
    </main>
  );
};

export default PostPage;
```

### post by slug

> https://www.prisma.io/docs/orm/prisma-schema/data-model/models

/prisma/schema.prisma:

**@unique**:

```prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  content   String
  published Boolean? @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

> @@ double alias means:

**@map**:

- if want different name can map

```prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  content   String
  published Boolean? @default(false)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt
}
```

**@@index**:

- @@index(_ fields: FieldReference[], map: String?)
- can improve the read performance

```prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  content   String
  published Boolean? @default(false)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt

  @@index(slug)
}
```

the url will change to http://localhost:3000/posts/first-post and unique.

## GET length of all posts (how many)

easy and common way using `.length`, but this method count for all:

```ts
<h1 className="text-3xl font-semibold">All Posts ({posts.length})</h1>
```

### GET length based on certain conditions (where)

> https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting

if we want to count certain posts, based on certain conditions like for when pagination. we want to take posts per page:

**basic filtering with the `where` query option, and sorting with the `orderBy` query option.**

```ts
const posts = await prisma.post.findMany({
  where: {
    title: {
      endsWith: "post",
    },
  },
  orderBy: {
    createdAt: "desc",
  },
  select: {
    id: true,
    title: true,
    slug: true,
  },
  take: 1,
  skip: 1,
});
```

- `take` & `skip` interesting used for pagination.
- `take` for pagination -> show how many post per page

advanced concept:

```ts
const result = await prisma.user.findMany({
  where: {
    email: {
      endsWith: 'prisma.io',
    },
    posts: {
      some: {
        published: true,
      },
    },
  },
  include: {
    posts: {
      where: {
        published: true,
      },
    },
  },
})
```

**count posts**:

```ts

```