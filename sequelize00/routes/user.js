const express = require("express");
const router = express.Router();

const path = require("path");

 
const Blog = require("../models/blog");
const Category = require("../models/category");
const {Op} = require("sequelize");

const userController = require("../controllers/user");

router.use("/blogs/category/:category_id",userController.blogs_by_category);


router.use("/blogs/:blogid", userController.blogs_details);


 
router.use("/blogs",userController.blogs_list );


router.use("/", userController.index);
 

module.exports = router;

 