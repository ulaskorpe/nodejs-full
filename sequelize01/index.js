////express modules
const express = require("express");
const app = express();

const cookieParser = require('cookie-parser');
const session = require('express-session');
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const csurf = require("csurf");
//// node modules
const path = require("path");

 ////routes
const userRoutes = require("./routes/user"); /// ./ in same dir
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");


///custom modules
const sequelize = require("./data/db");
const dummyData = require("./data/dummy-data");
const locals = require("./middlewares/locals");
const log = require("./middlewares/log");
const error_handling = require("./middlewares/error-handling");
////template engine
app.set("view engine", "ejs");

///models
const Blog = require("./models/blog");
const User = require("./models/user");
const Category = require("./models/category");
const Role = require("./models/role");

////middlewares 
app.use(express.urlencoded({ extended: true }))// form data nın json formatında gelmesini sağlar , 
app.use(cookieParser());
app.use(session({
    secret:"35b0ad46-0ba1-4233-82aa-36eaed7f0262",
    resave : true,
    saveUninitialized : false, // repo for every user
    cookie :{
        maxAge:1000*60*60, ///in ms , 1 hour x24 1 day
    },
    store : new SequelizeStore({
        db:sequelize /// uses sequelize as db , must run migs and create Sessions table
    })

}));

app.use(locals);/// uses middleware to reach local vars
app.use(csurf()); /// uses csrf tokens

app.use("/libs", express.static(path.join(__dirname, "node_modules")));///with alias 
app.use("/static", express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes); /// with prefix admin
app.use("/accounts", authRoutes); /// with prefix accounts
app.use(userRoutes);

app.use((req,res)=>{
    res.status(404).render("error/404",{title:"notfound"});
});

app.use(log);
app.use(error_handling );

// ilişkiler
// one to many
// Category.hasMany(Blog, {
//     foreignKey: {
//         name: 'categoryId',
//         allowNull: false,
//         //defaultValue: 1
//     },
//     onDelete : "RESTRICT", /// cant delete related files
//      //onDelete : "SET NULL", /// sets null default
//     onUpdate : "CASCADE"
// });
// Blog.belongsTo(Category);

///many to many
Blog.belongsTo(User,{
    foreignKey :{
        allowNull:true
    }
});
User.hasMany(Blog) ;

////hasone : foreign key added to target table  belongs to source table
Blog.belongsToMany(Category, { through: "blogCategories"});
Category.belongsToMany(Blog, { through: "blogCategories"});

 Role.belongsToMany(User,{through:"userRoles"});
 User.belongsToMany(Role,{through:"userRoles"});

// uygulanması - sync

// IIFE
/***
 * IIFE stands for "Immediately Invoked Function Expression." It is a common JavaScript design pattern used to create a self-contained scope for variables and functions. An IIFE is a function that is defined and executed immediately after its creation. This pattern is often used to encapsulate code and prevent variable and function names from polluting the global scope.
 * 
 */
// IIFE
(async () => {
    if(false){
      await sequelize.sync({ force: true });
//    // await sequelize.sync({ alter: true });
     await dummyData();
    }
})();

app.listen(3000, function () {
    console.log("listening on port 3000");
});