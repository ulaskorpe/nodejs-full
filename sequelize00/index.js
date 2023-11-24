const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: false }))// form data nın json formatında gelmesini sağlar , 
app.set("view engine", "ejs");


//console.log(app.get("view engine"));

const path = require("path");
const userRoutes = require("./routes/user"); /// ./ in same dir
const adminRoutes = require("./routes/admin");

const sequelize = require("./data/db");
const dummyData = require("./data/dummy-data");
const Category = require("./models/category");
const Blog = require("./models/blog");


app.use("/libs", express.static(path.join(__dirname, "node_modules")));///with alias 
app.use("/static", express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes); /// with prefix admin
app.use(userRoutes);

// ilişkiler
// one to many
Category.hasMany(Blog, {
    foreignKey: {
        name: 'categoryId',
        allowNull: false,
        //defaultValue: 1
    },
    onDelete : "RESTRICT", /// cant delete related files
     //onDelete : "SET NULL", /// sets null default
    onUpdate : "CASCADE"
});
Blog.belongsTo(Category);

// uygulanması - sync

// IIFE
/***
 * IIFE stands for "Immediately Invoked Function Expression." It is a common JavaScript design pattern used to create a self-contained scope for variables and functions. An IIFE is a function that is defined and executed immediately after its creation. This pattern is often used to encapsulate code and prevent variable and function names from polluting the global scope.
 * 
 */
// IIFE
(async () => {
//      await sequelize.sync({ force: true });
//    // await sequelize.sync({ alter: true });
//     await dummyData();
})();

app.listen(3000, function () {
    console.log("listening on port 3000");
});