import { prisma } from "./lib/prisma.js";

const now = new Date();

async function main() {
  const result = await prisma.user.createMany({
    data: [
      { username: "user1", password: "1111", picture: "default" },
      { username: "user2", password: "2222", picture: "default" },
    ],
  });

  await prisma.message.createMany({
    data: [
      { sender: 1, time: (new Date(now.getTime() + 60 * 1000)), text:"(1)how r u?", chat:1 },
      { sender: 2, time: (new Date(now.getTime() + 60 * 2000)), text:"(2)gud thanks! you?", chat :1 },
      { sender: 1, time: (new Date(now.getTime() + 60 * 3000)), text:"(3)im fine thanks! wanna go for drink?", chat:1 },
      { sender: 2, time: (new Date(now.getTime() + 60 * 4000)), text:"(4)sure man!", chat:1 },
    ],
  });

  await prisma.chatUser.createMany({
    data: [
      { user:1, chat:1 },
      { user:2, chat:1 },
    ],
  });

  await prisma.chat.create({
    data: {},
  });



  //console.log(result);
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
