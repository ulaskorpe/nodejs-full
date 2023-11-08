const express = require("express");

const app = express();

app.use(express.urlencoded({extended:false}))// form data nın json formatında gelmesini sağlar , 
app.set("view engine","ejs");


//console.log(app.get("view engine"));

const path = require("path");
 const userRoutes = require("./routes/user"); /// ./ in same dir
 const adminRoutes = require("./routes/admin");

//  const Blog = require("./models/blog");
// const Category = require("./models/category");

app.use("/libs", express.static(path.join(__dirname, "node_modules")));///with alias 
app.use("/static", express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes); /// with prefix admin
app.use(userRoutes);
 
app.listen(3000, function() {
    console.log("listening on port 3000");
});