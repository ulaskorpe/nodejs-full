const express = require("express");
const router = express.Router();


const imageUpload = require("../helpers/image-upload");

const isAdmin = require("../middlewares/is-admin");
const isModerator = require("../middlewares/is-moderator");
const csrf = require("../middlewares/csrf");

const adminController = require("../controllers/admin");


router.post("/blog/delete/:blogid",isAdmin,  adminController.post_blog_delete );

router.post("/categories/delete/:category_id",isAdmin, adminController.post_category_delete);

router.get("/blog/edit/:blogid",isModerator,csrf, adminController.get_blog_edit);

router.post("/blog/edit/:blogid",isModerator, imageUpload.upload.single("image"), adminController.post_blog_edit);

router.get("/blog/create",isModerator,csrf, adminController.get_blog_create);

router.post("/blog/create",isModerator, imageUpload.upload.single("image"), adminController.post_blog_create);

router.post("/category/remove-blog",isAdmin, adminController.post_category_blog_remove );

router.get("/category/create", isAdmin,csrf,adminController.get_category_create);

router.post("/category/create", isAdmin,adminController.post_category_create);

router.get("/category/edit/:category_id", isAdmin,csrf,adminController.get_category_edit);

router.post("/category/edit/:category_id", adminController.post_category_edit);

router.get("/blogs", isModerator,csrf,adminController.get_blogs);

router.get("/categories",isAdmin,csrf,  adminController.get_categories );

router.get("/roles",isAdmin,csrf ,adminController.get_roles);
router.get("/roles/:roleid",isAdmin, csrf, adminController.get_role_edit);
router.post("/roles/remove",isAdmin, csrf, adminController.roles_remove);
router.post("/roles/:roleid",isAdmin, adminController.post_role_edit);


router.get("/users", isAdmin, csrf, adminController.get_users);
 router.get("/users/:userid", isAdmin,csrf, adminController.get_user_edit);
 router.post("/users/:userid", isAdmin, adminController.post_user_edit);


module.exports = router;