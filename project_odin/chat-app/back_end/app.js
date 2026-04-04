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

app.get("/", (req, res) => {
  res.render("index", { user: req.user });


});

app.post("/signup", async (req, res) => {
  try {
    // Create user in the database
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: req.body.password,
        picture: "111", // placeholder, can change later
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

    //console.log("User was found");
    const token = jwt.sign(user, "POTATOKEY");

    res.json(token);
});

app.get("/user", authenticateToken, async (req, res) => {
    //let userId = req.params.userId;

    //console.log("Received request for user: ", req.user);

    const user = (await prisma.user.findMany({
        where: { username: req.user.username,
            password:req.user.password
         }
        }))[0];
    
    if (typeof user == "undefined"){
        res.json({"message":"USER NOT FOUND"})
        console.log("User was not found");
        return;
    }

    //console.log("User was found:", user);

    res.json(user);
});

app.post('/user/:userId', authenticateToken, upload.single('picture'), async (req, res) => {
    console.log("Received post to userId!");

    let filename = req.file.originalname; 
    let filelocation = req.file.path;
    let userId = req.params.userId;

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
        username: req.body.username,
        password: req.body.password,
        picture: filelocation
    }
    });
    res.json({message:"success"});
});

app.get('/messenger/:chatId', authenticateToken, async (req, res) => {
    let chatId = req.params.chatId;

    //console.log("Received chat request for: ", chatId);

    const messages = await prisma.message.findMany({
        where: {
        chat: Number(chatId),
        },
        orderBy: {
        time: 'desc',
        },
    });

    res.json(messages);
});


app.get('/messenger', authenticateToken, async (req, res) => {
    let user = req.user;
    
    //console.log(user, "ASKED FOR A messenger");

    const chats = await prisma.chatUser.findMany({
        where: {
            user:user.id
        }
    });

    //console.log(chats);

    let lastMessages = [];

    for (const chat of chats) {
        //console.log("CHAT IS: ", chats);
        const latestMessage = await prisma.message.findFirst({
            where: {
            chat: Number(chat.chat),
            },
            orderBy: {
            time: 'desc',
            },
        });
        //console.log("LATEST MESSAGE IS: ", latestMessage);
        lastMessages.push(latestMessage);
    } 
    
    //console.log("FOUND: ", lastMessages);
    res.json(lastMessages);
});

app.post('/message', authenticateToken, upload.single('picture'), async (req, res) => {    
    let chatId = req.body.chatId;
    let sender = req.body.sender;
    let text = req.body.text;



    let fileName =  "";
    let fileLocation = "";
    

    console.log("FILE IS: ", req.file);

    if (typeof req.file != "undefined"){
        console.log("Pic was provided");
        fileName = req.file.originalname; 
        fileLocation = req.file.path;
    }
    else{
        console.log("Pic was not provided");
    }
    
    try {
        // Create user in the database
        const message = await prisma.message.create({
        data: {
            sender: Number(sender),
            text: text,
            time: new Date(),
            chat: Number(chatId),
            fileName: fileName,
            filePath: fileLocation,
        },
        });

        //console.log("Created message:", message);

        // Send JSON response back to React
        res.status(201).json({
        message: "User message successfully"
        });
    } catch (error) {
        //console.error("Error creating user:", error);

        res.status(500).json({ error: "Failed to create user" });
  }
});

app.post('/chat', authenticateToken, async (req, res) => {    
    let recepientNames = req.body.recepientNames.split(" ");
    let sender = req.body.sender;
    let text = req.body.text;


    let recepients = [];

    try {
        for (let i = 0; i < recepientNames.length; i++){
            const recepient = await prisma.user.findFirst({
                where: {
                username: recepientNames[i],
                },
            });

            if  (!recepient){
                //console.log("Couldnt find that user! ", recepientNames[i]);
            continue;
            }

            recepients.push(recepient);
        };

        if (recepients.length < 1){
            console.log("Couldnt find any matching names!");
            return;
        }

        let newChat = await prisma.chat.create({
            data: {},
        });

        for (let i = 0; i < recepients.length; i++){
            await prisma.chatUser.create({
                data: {
                    user: Number(recepients[i].id),
                    chat: Number(newChat.id)
                },
            });
        }

        await prisma.chatUser.create({
            data: {
                user: Number(sender),
                chat: Number(newChat.id)
            },
        });

        await prisma.message.create({
            data: {
                sender: Number(sender),
                time: new Date(),
                text: text,
                chat: Number(newChat.id)
            },
        });

        //console.log("Created message:", message);

        // Send JSON response back to React
        res.status(201).json({
        message: "User message successfully"
        });
    } catch (error) {
        //console.error("Error creating user:", error);

        res.status(500).json({ error: "Failed to create user" });
  }
});

app.get('/chat/image/uploads/:filePath', authenticateToken, async (req, res) => {
  const { filePath } = req.params;

    console.log("Got image request!: ", filePath);
    // find if user is in that chat


  res.sendFile(path.resolve("uploads", filePath));
});
















app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
        //console.log("Provided:", username, " ", password);
      const user = (await prisma.user.findMany({
        where: { username: username }
        }))[0];

      if (!user) {
        //console.log("Incorrect username");
        return done(null, false, { message: "Incorrect username" });
      }

      const match = password ==  user.password ? true : false; 

      if (!match) {
        //console.log("Incorrect password");
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
        where: { id: id }
    });
 
    done(null, user);
  } catch(err) {
    done(err);
  }
});

app.post("/", upload.single('avatar'), (req,res) => {
    console.log("Posted to the homepage");
    //onsole.log(req);

});

app.get("/folders", (req,res) => {
    // show root folder
    //console.log(req.user);
    let root_id = req.user.root_folder_id;

    
    res.redirect("/folders/" + root_id);

});

app.get("/folders/:folderId", async(req,res) => {
    //console.log("REQUESTED ID: ", req.params.folderId);

    let folderPath = [];
    try{
        folderPath = await getChosenFolderPath(req.params.folderId);
    }
    catch{
        console.log("Caught exception");
    }

    let displayLogic = {id:req.params.folderId};
    let current = displayLogic;

    for (let i = 0; i < folderPath.length; i++) {
        const id = folderPath[i];
        const nextId = folderPath[i + 1];

        const subfolders = await prisma.folder.findMany({
            where: { parent: id }
        });

        current["children"] = subfolders ;

        const nextFolder = subfolders.find(f => f.id === nextId);
        if (nextFolder) {
            nextFolder.children = [];
            
            current = nextFolder;
        }
    }

    //console.log(displayLogic);
    //console.log(JSON.stringify(displayLogic, null, 2));

    let files = (await prisma.file.findMany({
        where: { folder_id:  req.params.folderId }
        }));
    
    let currentFolder = (await prisma.folder.findMany({
        where: { id:  Number(req.params.folderId) }
        }))[0];


    if (req.query.passcode){
        //console.log("PROVIDED PASSCODE: ", req.query.passcode);
        res.render("folders", {folders:displayLogic["children"], containerFolder:displayLogic.id, files:files, currentFolder:currentFolder, passcode:req.query.passcode});
    }
    else{
        res.render("folders", {folders:displayLogic["children"], containerFolder:displayLogic.id, files:files, currentFolder:currentFolder});
    }

});




app.post('/folders/:folderId/download', async (req, res) => {
    //console.log(req.query.fileId, "");

    const file = (await prisma.file.findMany({
        where: { id: Number(req.query.fileId) }
    }))[0];

    res.download(file.path, file.name);

});

app.post('/folders/:folderId/update', async (req, res) => {
    //console.log(req.query.fileId, "");

    const file = await prisma.folder.update({
        where: { id: Number(req.params.folderId) },
        data: {
            name: req.body.name,
            parent: Number(req.body.parent)
        }
    });

    res.redirect('/folders/' + req.params.folderId);

});

app.post('/folders/:folderId/delete', async (req, res) => {
    //console.log(req.query.fileId, "");

    deleteFolder(Number(req.params.folderId));


    res.redirect('/folders');

});

app.post('/folders/:folderId/addSubfolder', async (req, res) => {
    //console.log(req.query.fileId, "");

    const file = await prisma.folder.create({
        data: {
            parent:Number(req.params.folderId),
            name:req.body.name
        },
    });

    res.redirect('/folders/' + req.params.folderId);

});

app.get('/passcode/:passcode', async (req,res) => {
    //console.log("Passcode is: ", req.params.passcode);

    const passcode = (await prisma.passcode.findMany({
        where: { code: req.params.passcode }
    }))[0];
    console.log("Passcode folder: ", passcode.folder);

    if (typeof passcode == "undefined"){
        res.send("Passcode invalid");
        return;
    }

    if (passcode.expires_on < new Date()){
        res.send("Passcode expired");
        return;
    }


    let files = (await prisma.file.findMany({
        where: { folder_id:  "" + passcode.folder }
    }));




    console.log("Files: ", files)

    res.render("passcode", {files:files});


});

app.post('/passcode/:folderId/create', async (req, res) => {
    console.log("CREATING PASSCODE");
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let passcode = Array.from({ length:10 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    
    const expiresOn = new Date();
    expiresOn.setDate(expiresOn.getDate() + 1);     

    const codeObject = await prisma.passcode.create({
        data: {
            code:passcode,
            expires_on:expiresOn,
            folder:req.params.folderId
        },
    });

    res.redirect(`/folders/${req.params.folderId}?passcode=${passcode}`);

});

app.post('/passcode/download', async (req, res) => {
    
    const file = (await prisma.file.findMany({
        where: { id: Number(req.query.fileId) }
    }))[0];

    res.download(file.path, file.name);

});


app.listen(3000, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});


async function deleteFolder(folderId) {

    // find child folders
    const children = await prisma.folder.findMany({
        where: { parent: folderId }
    });

    // delete children first
    for (const child of children) {
        await deleteFolder(child.id);
    }

    // delete files inside this folder
    await prisma.file.deleteMany({
        where: { folder_id: String(folderId) }
    });

    // delete the folder itself
    await prisma.folder.delete({
        where: { id: folderId }
    });
}


async function  getChosenFolderPath(folderId){
    let path = [];

    let folder = undefined; 

    do{
        path.unshift(Number(folderId));
        folder = await prisma.folder.findUnique({
            where: { id: Number(folderId) }
        });

        folderId = folder.parent;
        //console.log("Parents is: ", folderId);
    }
    while(folder.parent !== null )

    return path;
}




















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