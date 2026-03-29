import { prisma } from "./lib/prisma.js";

async function main() {
  // Create a new user with a post
  const user = await prisma.target.createMany({
    data: 
    [
      {identifier:"11",
      topx:"0.87",
      topy:"0.45",
      bottomx:"0.96",
      bottomy:"0.92"},

      {identifier:"13",
      topx:"0.76",
      topy:"0.47",
      bottomx:"0.87",
      bottomy:"0.68"},

      {identifier:"12",
      topx:"0.27",
      topy:"0.4",
      bottomx:"0.36",
      bottomy:"0.88"},


      {identifier:"21",
      topx:"0.15",
      topy:"0.59",
      bottomx:"0.30",
      bottomy:"0.92"},

      {identifier:"22",
      topx:"0.64",
      topy:"0.48",
      bottomx:"0.80",
      bottomy:"0.89"},

      {identifier:"23",
      topx:"0.75",
      topy:"0.25",
      bottomx:"0.90",
      bottomy:"0.47"},


      {identifier:"31",
      topx:"0.87",
      topy:"0.30",
      bottomx:"0.95",
      bottomy:"0.56"},

      {identifier:"32",
      topx:"0.80",
      topy:"0.74",
      bottomx:"0.89",
      bottomy:"0.99"},

      {identifier:"33",
      topx:"0.10",
      topy:"0.51",
      bottomx:"0.16",
      bottomy:"0.78"},
    ]
  
  });

  await prisma.leaderboard.createMany({
    data: 
    [
      {imageid:"1",
      time:111,
      username:"A"},

      {imageid:"1",
      time:222,
      username:"B"},

      {imageid:"1",
      time:444,
      username:"C"},

      {imageid:"1",
      time:333,
      username:"D"},

      {imageid:"2",
      time:444,
      username:"AA"},

      {imageid:"2",
      time:666,
      username:"CC"},

      {imageid:"2",
      time:555,
      username:"BB"},

      {imageid:"3",
      time:9999,
      username:"DD"},
      
    ]
  
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
