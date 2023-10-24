const express = require("express");
const router = express.Router();

const path = require("path");

router.use("/blogs/:blogid", function(req, res) {
   // res.sendFile(path.join(__dirname, "../views/users","blog-details.html"));
    res.render("users/blog-details");
});

router.use("/blogs", function(req, res) {
    //res.sendFile(path.join(__dirname, "../views/users","blogs.html"));
    res.render("users/blogs");
});

router.use("/", function(req, res) {
    //res.sendFile(path.join(__dirname, "../views/users","index.html"));
    res.render("users/index");
});

module.exports = router;