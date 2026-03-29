import { prisma } from "./lib/prisma.js";

async function main() {
    await prisma.user.createMany({
        data: [
            { username: "Alisa", role:"author", password:"1111" },
            { username: "Bodega", role:"commentor", password:"2222" }
        ],
        });

    await prisma.post.createMany({
        data: [
            { title: "Alisa's first post", text:"Lorem ipsum yopta1111", status:"draft", published_at:"2026-01-02", user_id:1 },
            { title: "Alisa's second post", text:"Lorem ipsum yopta2222", status:"published", published_at:"2026-01-18", user_id:1 }
        ],
        });

    await prisma.comment.createMany({
        data: [
            { text:"Very angry comment", created_at:"2026-01-22", post_id:2, user_id:2 }
        ],
        });

}


main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
