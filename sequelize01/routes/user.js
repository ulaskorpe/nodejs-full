const express = require("express");
const router = express.Router();

const path = require("path");
const csrf = require("../middlewares/csrf");
 
const Blog = require("../models/blog");
const Category = require("../models/category");
const {Op} = require("sequelize");

const userController = require("../controllers/user");

//router.use("/blogs/category/:category_id",userController.blogs_by_category);
router.get("/blogs/category/:slug",csrf,userController.blogs_list);


///router.use("/blogs/:blogid", userController.blogs_details);
router.get("/blogs/:slug",csrf, userController.blogs_details);


 
router.get("/blogs",csrf,userController.blogs_list );


router.get("/", csrf,userController.index);
 

module.exports = router;

 