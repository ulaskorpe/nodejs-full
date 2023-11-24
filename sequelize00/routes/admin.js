const express = require("express");
const router = express.Router();


const imageUpload = require("../helpers/image-upload");

const adminController = require("../controllers/admin");

router.post("/blog/delete/:blogid", adminController.post_blog_delete );

router.post("/categories/delete/:category_id", adminController.post_category_delete);

router.get("/blog/edit/:blogid", adminController.get_blog_edit);

router.post("/blog/edit/:blogid", imageUpload.upload.single("image"), adminController.post_blog_edit);

router.get("/blog/create", adminController.get_blog_create);

router.post("/blog/create", imageUpload.upload.single("image"), adminController.post_blog_create);

router.get("/category/create", adminController.get_category_create);

router.post("/category/create", adminController.post_category_create);

router.get("/category/edit/:category_id", adminController.get_category_edit);
router.post("/category/edit/:category_id", adminController.post_category_edit);

router.use("/blogs", adminController.get_blogs);


  router.use("/categories", adminController.get_categories );

module.exports = router;