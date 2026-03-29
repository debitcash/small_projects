const express = require("express");
const cors = require("cors");
const { prisma } = require("./lib/prisma.js");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/check", async (req, res) => {
    const { identifier, x, y } = req.query;
    //console.log(identifier, x, y)
    
    let result = (await prisma.target.findMany({
        where: { identifier: identifier}
    }))[0];

    //console.log(result);
    //console.log(Number(result.topx) <Number(x) , Number(result.bottomx) > Number(x) ,
    //    Number(result.topy) , Number(y) , Number(result.bottomy) , Number(y));
    
    if (Number(result.topx) < Number(x) && Number(result.bottomx) > Number(x) &&
        Number(result.topy) < Number(y) && Number(result.bottomy) > Number(y)
    ){
        res.json({status:"valid", topx:result.topx, topy:result.topy, bottomx:result.bottomx, bottomy:result.bottomy});
    }
    else{
        res.json({status:"invalid"});
    }
});

app.post("/newuser", async (req, res) => {
    let { name } = req.body; 
    const { time, imageId } = req.query;
    //console.log("POST RECEIVERD", name, time, imageId);

    const newEntry = await prisma.leaderboard.create({
    data: {
        imageid: imageId,
        username: name,
        time: Number(time),
    },
    });

    res.json({status:"done"});
});

app.get("/leaberboard/:imageId", async (req, res) => {
    let { imageId } = req.params;
    
    //console.log("LEADERBOARD REQUEST", imageId);

    let result = await prisma.leaderboard.findMany({
        where: { imageid: imageId },
        orderBy: {
            time: "asc",
        },
    });


    res.json(result);
});



app.listen(3000, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});
