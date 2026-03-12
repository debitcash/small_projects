const express = require("express");
const path = require("node:path");
const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require('passport-local').Strategy;
const { body, validationResult } = require("express-validator");

let clubSecret = "secret";

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

const { Pool } = require("pg");
const pool = new Pool({
  connectionString:"postgresql://macbook@localhost:5432/members_only"
});

const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.get("/", async (req,res) => {
    if (req.user){
        let { rows } = await pool.query("SELECT title, time, text, first, last, membership_type, users.admin FROM messages JOIN users ON messages.user_id = users.id");

        console.log(rows);

        res.render("home",{allPosts:rows});
    }
    else{
        res.render("home");
    }
});

app.get("/sign-up", (req,res) => {
    res.render("sign-up");
});

app.post("/sign-up", 
    body('passwordConfirmation').custom((value, { req }) => {
        console.log("VALUES: ", value, " --- ", req.body.password, "RESULT: ", value === req.body.password);
        return value === req.body.password;
    }),    

    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("sign-up", { errors: {} });
        }
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            //console.log("IS ADMIN", req.body.is_admin);

            let is_admin = req.body.is_admin == "on" ? "T" : "F";   

            await pool.query("INSERT INTO users (first, last, email, password, admin) VALUES ($1, $2, $3, $4, $5)", [
            req.body.first,
            req.body.last,
            req.body.email,
            hashedPassword,
            is_admin
            ]);
            res.redirect("/");
        } catch(err) {
            return next(err);
    }
});


app.get("/log-in", (req,res) => {
    return res.render("log-in", { errors: {} });
});

app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM users WHERE first = $1", [username]);
      const user = rows[0];

      const match = await bcrypt.compare(password, user.password);

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      //console.log("LOGGED IN!");
      
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
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];

    done(null, user);
  } catch(err) {
    done(err);
  }
});



app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);


app.get("/join-club", (req,res)=>{
    res.render("join-club");
});

app.post("/join-club", async (req,res)=>{
    // if result == secrte
    // update the users table column membership_type with "advanced"
    //console.log(req.user);

    if (req.body.secret == clubSecret && req.user){
        //console.log("pass", req.user);
        await pool.query("UPDATE users SET membership_type = 'advanced' WHERE id = $1", [req.user.id]);
        res.redirect("/");
    }
    else {
        //console.log("fail");
        res.render("join-club", {error:"Wrong secret key"});
    }
});

app.post("/", async (req,res)=>{
    console.log(req.body);

    const now = new Date();
    const formatted = now.toISOString().slice(0,16).replace('T',' ');
    
    await pool.query("INSERT INTO messages (title, text, time, user_id) VALUES ($1, $2, $3, $4)", 
        [req.body.title, req.body.text, formatted, req.user.id]);

    res.redirect("/");
});

app.post("/delete_message", async (req,res) => {
   await pool.query("DELETE FROM messages WHERE text = $1", [req.body.message_text]);
    res.redirect("/");
});

app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});








app.listen(port);