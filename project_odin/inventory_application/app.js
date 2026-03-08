const express = require("express");
const path = require("node:path");
const appRouter = require("./routes/appRouter");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

const port = process.env.PORT || 3000;

app.use("/", appRouter);

app.listen(port);

