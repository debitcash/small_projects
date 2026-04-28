import { prisma } from "./lib/prisma.js";

const now = new Date();

async function main() {
  const result1 = await prisma.post.createMany({
    data: [
      { user_id: 1, image: "1.jpg", text: "8 ball in the rock!", created_at:new Date(new Date().setDate(new Date().getDate() - 1)) },
      { user_id: 1, image: "2.jpg", text: "SEVEN ELEVEN STORE IS DA BEST", created_at:new Date(new Date().setDate(new Date().getDate() - 2)) },
      { user_id: 1, text: "666", created_at:new Date(new Date().setDate(new Date().getDate() - 3)) },
      { user_id: 1, image: "4.jpg", text: "5 is always a charm just kile in out lifes!", created_at:new Date(new Date().setDate(new Date().getDate() - 4)) },
      { user_id: 1, text: "4postecki?", created_at:new Date(new Date().setDate(new Date().getDate() - 5)) },
      { user_id: 1, image: "6.jpg", text: "THIRD POST INCOMING YAEH BUDDDY!", created_at:new Date(new Date().setDate(new Date().getDate() - 6)) },
      { user_id: 1, image: "7.jpg", text: "And second post right here", created_at:new Date(new Date().setDate(new Date().getDate() - 7)) },
      { user_id: 1, text: "Hi this is first post", created_at:new Date(new Date().setDate(new Date().getDate() - 8)) },
    ],
  });

  const result2 = await prisma.user.createMany({
    data: [
      { username: "user1", password: "1111", picture: "default" },
      { username: "user2", password: "2222", picture: "default" },
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
