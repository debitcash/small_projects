const express = require("express");
const path = require("node:path");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

const messages = [
  {
    text: "Hi there!",
    user: "Amando",
    added: new Date()
  },
  {
    text: "Hello World!",
    user: "Charles",
    added: new Date()
  }
];



app.get("/", (req, res)=>{
  res.render("index", {messages:messages});
});

app.get("/new", (req,res)=>{
  res.render("new");
});


app.get("/posts/:messageId", (req,res)=>{
  res.render("posts",{message:messages[req.params.messageId]});
});

app.post("/new", (req,res)=>{
  messages.push({ text: req.body.message, user: req.body.name, added: new Date() }); 
  res.redirect("/");
});

app.listen(3000);
