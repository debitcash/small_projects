const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const { prisma } = require("./lib/prisma");
const cors = require("cors");

const app = express();
app.use(express.json());
const jwt = require('jsonwebtoken');
app.use(cors());



app.get("/posts", async (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null){
        const allPosts = await prisma.post.findMany({
            where: { status:"published"  }
        });
        res.json(allPosts);
        return;
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, async (err, user) => {
        //console.log(0, user);
        if (err) { 
            console.log(111);
            let allPosts= await prisma.post.findMany({
            where: { status:"published"  }
            });
            
            res.json(allPosts);

            return;
        }

        if (user.role == "author"){
            //console.log("22222");
            const allPosts = await prisma.post.findMany();
            
            res.json(allPosts);
        }

        else{
            let allPosts= await prisma.post.findMany({
            where: { status:"published"  }
            });
            
            res.json(allPosts);
        }
        


    })

});

app.get("/posts/:id", async (req, res) => {
    let id = Number(req.params.id);

    let post = (await prisma.post.findMany({
        where: { id: id }
        }))[0];

    res.json(post);
});

app.get("/comments", async (req, res) => {
    const allComments = await prisma.comment.findMany();

  res.json(allComments);
});

app.get("/comments/:id", async (req, res) => {
    let id = Number(req.params.id);

    let comment = (await prisma.comment.findMany({
        where: { post_id: id }
        }));

    res.json(comment);
});










app.post("/posts", authenticateToken, async (req, res) => {
    const today = new Date();
    const published_at = today.toISOString().split("T")[0];
    
    const newPost = await prisma.post.create({
        data: {...req.body, published_at:published_at, user_id:req.user.id},
    });

    let posts = (await prisma.post.findMany());
    
    

    res.json(posts);
});

app.post("/comments/:postId", async (req, res) => {
    const newComment = await prisma.comment.create({
        data: {
            text: req.body.text,
            created_at: req.body.created_at,
            post_id: req.body.post_id,
            user_id: req.body.user_id,
        },
    });

    res.json(newComment);
});












app.post("/login", async (req, res) => {

    const username = req.body.username;

    const user = (await prisma.user.findMany({
        where: { username: req.body.username,
            password:req.body.password
         }
        }))[0];
    
    //console.log(user);

    if (typeof user == "undefined"){
        res.json({"message":"NOT FOUND"})
        return;
    }

    const token = jwt.sign(user, process.env.ACCESS_TOKEN);

    res.json(token);
});



function authenticateToken(req, res, next){
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.json({"message":"NO TOKEN PROVIDED"});

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) return res.json({"message":"NOT VALID TOKEN"});

        req.user = user;
        next();

    })
    
}


// AMIN AUTH FUNCTION ON ALL POST?DELETES








app.put("/posts", authenticateToken, async (req, res) => {
    //console.log("GOT THE PSOT WITH", req.body);

    await prisma.post.update({
        where: { id: req.body.id },        // the ID of the post you want to update
        data: 
            req.body
        
    });

    const allPosts = await prisma.post.findMany();
            
    //console.log("NEW IS: ", allPosts);

    res.json(allPosts);



});

app.put("/comments", authenticateToken, async (req, res) => {
    //console.log("GOT THE PSOT WITH", req.body);

    await prisma.comment.update({
        where: { id: req.body.id },        // the ID of the post you want to update
        data: 
            req.body
        
    });

    const allComments = await prisma.comment.findMany();
            
    //console.log("NEW IS: ", allPosts);

    res.json(allComments);
});














app.delete("/comments", authenticateToken, async (req, res) => {
    let current_post = req.body.post_id;

    await prisma.comment.delete({
        where: { id: req.body.id }
        
    });

    const allComments = await prisma.comment.findMany({where: { post_id: current_post }});
            
    //console.log("NEW IS: ", allPosts);

    res.json(allComments);
});









app.listen(3000, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});