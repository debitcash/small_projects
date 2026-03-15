const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const { prisma } = require("./lib/prisma");
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

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

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
    //console.log("Receiverd: ", req.body.username, req.body.password);

    const user = await prisma.user.create({
    data: {
        username: req.body.username,
        password: req.body.password,
    }
    });

    // 2. Create the root folder linked to this user
    const folder = await prisma.folder.create({
        data: {
            parent: null, // root folder has no parent
        },
    });

    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { root_folder_id: folder.id },
    });


  //console.log("Created user:", user);

  res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("login");
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

app.post('/folders/:folderId', upload.single('file'), async (req, res) => {
  //console.log(req.file); 
  // req.file.path -> the path on server

    let filename = req.file.originalname; 
    let path = req.file.path;
    let size = req.file.size;
    let folderId = req.params.folderId;

    const file = await prisma.file.create({
        data: {
            name: filename,
            size: size,
            folder_id: folderId,
            path: path
        },
    });


    
    res.redirect("/folders/" + folderId);
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