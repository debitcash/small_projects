const express = require("express");
const path = require("node:path");
const pool = require("./pool");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;



app.get("/", async (req, res)=>{
  let {rows} = await pool.query("SELECT * FROM recordstable");
  //console.log(rows);
    
  res.render("index", {records:rows});
});

app.get("/new", (req,res)=>{
  res.render("new");
});


app.get("/posts/:messageId", async (req,res)=>{
  let {rows} = await pool.query("SELECT * FROM recordstable WHERE id = $1", [req.params.messageId]);
  res.render("posts",{record:rows[0]});
});

app.post("/new", async (req,res)=>{
  //messages.push({ text: req.body.message, user: req.body.name, added: new Date() }); 
  //console.log("Adding to the database");
  await pool.query("INSERT INTO recordstable (username, message) VALUES ($1, $2)", [req.body.name, req.body.message]);
  
  res.redirect("/");
});

app.listen(port);
