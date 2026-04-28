const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const { prisma } = require("./lib/prisma");
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const cors = require("cors");
const jwt = require('jsonwebtoken');
const fs = require('fs');


const app = express();
app.use(cors());
app.use(express.json()); // <<< ADD THIS
app.use(express.urlencoded({ extended: false }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use("/uploads", express.static("uploads"));

app.use(
  session({
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
    secret: "cats",
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000
    })
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));


app.post("/signup", async (req, res) => {
  try {
    // Create user in the database
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: req.body.password,
        picture: "",
        about:"Default 'about' text", 
      },
    });

    console.log("Created user:", user);

    // Send JSON response back to React
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        username: user.username,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);

    // Send error response
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.post("/login", async (req, res) => {

    //console.log("Received: ", req.body.username, req.body.password);

    const user = (await prisma.user.findMany({
        where: { username: req.body.username,
            password:req.body.password
         }
        }))[0];
    
    if (typeof user == "undefined"){
        res.json({"message":"NOT FOUND"})
        console.log("User was not found");
        return;
    }

    
    const token = jwt.sign(user, "POTATOKEY");

    //console.log("Response: ", { token, user:user });

    res.json({ token, user:user });
});


app.get("/profile/:profileId", async (req, res) => {

    //console.log("Received: ", req.params.profileId);

    const user = (await prisma.user.findMany({
        where: { id: Number(req.params.profileId)
         }
        }))[0];

    const firstTwoPosts = await prisma.post.findMany({
        where: {
            user_id: Number(req.params.profileId),
        },
        orderBy: {
            created_at: 'desc', // newest first
        },
        take: 2,
    });

    const posts = await prisma.post.findMany({
            where: {
                user_id: Number(user.id),
            }
        });

    const followers = await prisma.follower.findMany({
            where: {
                following_id: Number(user.id),
            }
        });

    const following = await prisma.follower.findMany({
            where: {
                follower_id: Number(user.id),
            }
        });
    
    const likes = await prisma.like.findMany({
            where: {
                user_id: Number(user.id),
            }
        });

    user["posts"] = posts.length;

    user["followers"] = followers.length;

    user["following"] = following.length;

    user["likes"] = likes.length;

    //console.log("found posts: ", firstTwoPosts);
    
    if (typeof user == "undefined"){
        res.json({"message":"NOT FOUND"})
        console.log("User was not found");
        return;
    }

    let likedBy=[];

    for (let i = 0; i < firstTwoPosts.length; i++){
        const likes = await prisma.like.findMany({
            where: {
                post_id: Number(firstTwoPosts[i].id),
            },
            select: {
                user_id: true
            }
        });

        likes.map(like => likedBy.push(like.user_id));
        firstTwoPosts[i]["likedBy"] = [...likedBy];

        likedBy = [];
    }
    
    //const token = jwt.sign(user, "POTATOKEY");

    //console.log("Response: ", user);

    res.json({user,firstTwoPosts});
});

app.post('/user/:userId', authenticateToken, upload.single('newAvatarFile'), async (req, res) => {
    //console.log("Received post to userId!");

    //let filename = req.file.originalname; 
    //let filelocation = req.file.path;
    let userId = req.params.userId;

    //console.log(req.file);

    const filePath = path.join(__dirname, req.user.picture);
    
    fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting file:", err);
        else console.log("File deleted");
    });
    

    const user = await prisma.user.update({
    where: {
        id: Number(userId)
    },
    data: {
        username: req.body.newUsername,
        about: req.body.newProfileDescription,
        picture: req.file.path
    }
    });
    res.json({...user, picture:req.file.path});
    
});

app.use('/uploads', express.static('uploads'));

app.get("/posts/:profileId", async (req, res) => {

    console.log("Received request for posts with the number of: ", req.query.count);

    const posts = await prisma.post.findMany({
        where: {
            user_id: Number(req.params.profileId),
        },
        orderBy: {
            created_at: 'desc', // newest first
        },
        take: Number(req.query.count) + 2,
    });
    
    if (typeof posts == "undefined"){
        res.json({"message":"NOT FOUND"})
        console.log("User was not found");
        return;
    }

    let likedBy = [];

    for (let i = 0; i < posts.length; i++){
        const likes = await prisma.like.findMany({
            where: {
                post_id: Number(posts[i].id),
            },
            select: {
                user_id: true
            }
        });

        likes.map(like => likedBy.push(like.user_id));
        posts[i]["likedBy"] = [...likedBy];

        likedBy = [];
    }

    //console.log("SENDING: ", posts);

    res.json(posts);
});

app.post('/newpost/:userId', authenticateToken, upload.single('image'), async (req, res) => {
    //console.log("Received post to userId!");    
    let image = req.file ? req.file.filename : null;

    const newpost = await prisma.post.create({
    data: {
        user_id: Number(req.params.userId),
        image: image,
        text: req.body.message,
        created_at: new Date()
    }
    });
});

app.get("/profiles", authenticateToken, async (req, res) => {

    const users = await prisma.user.findMany();

    for (let i = 0; i < users.length; i++){
        const subscribers = await prisma.follower.findMany({
            where: {
                following_id: Number(users[i].id),
            }
        });

        const posts = await prisma.post.findMany({
            where: {
                user_id: Number(users[i].id),
            }
        });

        const likes = await prisma.like.findMany({
            where: {
                user_id: Number(users[i].id),
            }
        });

        users[i]["subscribers"] = subscribers.length;
        users[i]["posts"] = posts.length;
        users[i]["likes"] = likes.length;
    }

    res.json(users);
});

app.post('/follow/:userId', authenticateToken, async (req, res) => {
   // console.log("Received post to userId!");    
    
    //console.log("NOW ", req.user.id ," IS FOLLOWING ", req.params.userId);

    const alreadyFollowing = await prisma.follower.findMany({
    where: {
        follower_id: Number(req.user.id),
        following_id: Number(req.params.userId)
    }});

    //console.log("ISA LAREADY FOLLOWIENG:", alreadyFollowing);

    if (alreadyFollowing.length > 0){
        await prisma.follower.deleteMany({
        where: {
            follower_id: Number(req.user.id),
            following_id: Number(req.params.userId)
        }});
    }
    else{
        const followerRelationship = await prisma.follower.create({
        data: {
            follower_id: Number(req.user.id),
            following_id: Number(req.params.userId),
        }});
    }

    const followingUsers = await prisma.follower.findMany({
    where: {
        follower_id: Number(req.user.id)
    }});

    let following = followingUsers.map(record => record.following_id);

    res.send(following);
});

app.get('/following', authenticateToken, async (req, res) => {
    //console.log("Received post to userId!");    
    
    //console.log("NOW ", req.user.id ," IS FOLLOWING ", req.params.userId);

    const followingUsers = await prisma.follower.findMany({
    where: {
        follower_id: Number(req.user.id)
    }});

    let following = followingUsers.map(record => record.following_id);


    res.send(following);
});

app.get('/feed/:userId', authenticateToken, async (req, res) => {
    //console.log("Received post to userId!");    
    
    //console.log("NOW ", req.user.id ," IS FOLLOWING ", req.params.userId);

    const subscribedTo = await prisma.follower.findMany({
        where: {
            follower_id: Number(req.user.id)
        },
        select: {
            following_id: true
        }
    });

    //console.log("This suer is subscrbed to: ", subscribedTo);

    const allPosts = [];

    for (let i = 0; i < subscribedTo.length; i++){
        //console.log("Looking fo: ", subscribedTo[i].following_id);

        const followee = (await prisma.user.findMany({
            where: {
                id: Number(subscribedTo[i].following_id)
            }
        }))[0];

       // console.log("FOLLOWEE: ", followee);


         const posts = await prisma.post.findMany({
            where: {
                user_id: Number(subscribedTo[i].following_id)
            }
        });

        const postsWithUser = posts.map(post => ({
            ...post,
            user:followee
        }));

        allPosts.push(...postsWithUser);
    }

    //console.log("ALL POSTS FOLLOWING:", allPosts);

    let likedBy=[];

    for (let i = 0; i < allPosts.length; i++){
        const likes = await prisma.like.findMany({
            where: {
                post_id: Number(allPosts[i].id),
            },
            select: {
                user_id: true
            }
        });

        likes.map(like => likedBy.push(like.user_id));
        allPosts[i]["likedBy"] = [...likedBy];

        likedBy = [];

        const comments = await prisma.comment.findMany({
            where: {
                post_id: Number(allPosts[i].id),
            }
        });

        for (let i = 0; i < comments.length; i++){
            const user = (await prisma.user.findMany({
                where: {
                    id: Number(comments[i].user_id)
                }
            }))[0];

            comments[i]["commentor"] = user;
        }

        allPosts[i]["comments"] = [...comments];
    }

    res.send(allPosts);
});

app.get('/like/:postId', authenticateToken, async (req, res) => {
    const alreadyLiked = await prisma.like.findMany({
    where: {
        user_id: Number(req.user.id),
        post_id: Number(req.params.postId)
    }});

    if (alreadyLiked.length > 0){
        await prisma.like.deleteMany({
        where: {
            user_id: Number(req.user.id),
            post_id: Number(req.params.postId)
        }});
    }
    else{
        await prisma.like.create({
        data: {
            user_id: Number(req.user.id),
            post_id: Number(req.params.postId)
        }});
    }

    const posts = await prisma.post.findMany({
        where: {
            user_id: Number(req.query.profileId),
        },
        orderBy: {
            created_at: 'desc', // newest first
        },
        take: Number(req.query.count) + 2,
    });

    let likedBy=[];

    for (let i = 0; i < posts.length; i++){
        const likes = await prisma.like.findMany({
            where: {
                post_id: Number(posts[i].id),
            },
            select: {
                user_id: true
            }
        });

        likes.map(like => likedBy.push(like.user_id));
        posts[i]["likedBy"] = [...likedBy];

        likedBy = [];
    }
    
    //console.log("SENDING: ", posts);
    res.json(posts);
});

app.post('/newcomment', authenticateToken, upload.none(), async (req, res) => {
    //let image = req.file ? req.file.filename : null;
    //console.log("RECEIVED: ", req.body);

    const newpost = await prisma.comment.create({
    data: {
        user_id: Number(req.body.user_id),
        post_id: Number(req.body.post_id),
        text: req.body.text,
        created_at: new Date()
    }
    });


    const subscribedTo = await prisma.follower.findMany({
        where: {
            follower_id: Number(req.user.id)
        },
        select: {
            following_id: true
        }
    });

    //console.log("This suer is subscrbed to: ", subscribedTo);

    const allPosts = [];

    for (let i = 0; i < subscribedTo.length; i++){
        //console.log("Looking fo: ", subscribedTo[i].following_id);

        const followee = (await prisma.user.findMany({
            where: {
                id: Number(subscribedTo[i].following_id)
            }
        }))[0];

       // console.log("FOLLOWEE: ", followee);


         const posts = await prisma.post.findMany({
            where: {
                user_id: Number(subscribedTo[i].following_id)
            }
        });

        const postsWithUser = posts.map(post => ({
            ...post,
            user:followee
        }));

        allPosts.push(...postsWithUser);
    }

    //console.log("ALL POSTS FOLLOWING:", allPosts);

    let likedBy=[];

    for (let i = 0; i < allPosts.length; i++){
        const likes = await prisma.like.findMany({
            where: {
                post_id: Number(allPosts[i].id),
            },
            select: {
                user_id: true
            }
        });

        likes.map(like => likedBy.push(like.user_id));
        allPosts[i]["likedBy"] = [...likedBy];

        likedBy = [];

        const comments = await prisma.comment.findMany({
            where: {
                post_id: Number(allPosts[i].id),
            }
        });

        for (let i = 0; i < comments.length; i++){
            const user = (await prisma.user.findMany({
                where: {
                    id: Number(comments[i].user_id)
                }
            }))[0];

            comments[i]["commentor"] = user;
        }

        allPosts[i]["comments"] = [...comments];
    }




    res.send(allPosts);
});














function authenticateToken(req, res, next){
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.json({"message":"NO TOKEN PROVIDED"});

    jwt.verify(token, "POTATOKEY", (err, user) => {

        //console.log("TOKEN RECEIVED===" + token + "===");
        if (err) return res.json({"message":"NOT VALID TOKEN"});

        req.user = user;
        next();

    })
    
}

app.listen(3000, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});