const express = require("express");
const router = express.Router();

const path = require("path");
 
const fs = require("fs");
const imageUpload = require("../helpers/image-upload");

const Blog = require("../models/blog");
const Category = require("../models/category");
const {Op} = require("sequelize");
router.post("/blog/delete/:blogid", async function(req, res) {
  
  try {
    const id = req.params.blogid;
    const blog = await Blog.findByPk(id);

    if(blog.image) {
        fs.unlink('./public/images/' + blog.image, err => {
            console.log(err);
        });
    }
    blog.destroy();
 //  await db.execute("delete from blogs where id=?",[id]);
     res.redirect("/admin/blogs?action=delete");
}
catch(err){
    console.log(err);
}
});


router.post("/categories/delete/:category_id", async function(req, res) {
  
  try {
    const id = req.params.category_id;



    await Blog.update({category_id : 0},{where : {
      category_id:id

     }});
     await  Category.destroy({
      where: { id : id }
     })
  //  await db.execute("delete from categories where id=?",[id]);
  //  await db.execute("UPDATE blogs SET category_id=0 where id=?",[id]);
     res.redirect("/admin/categories?action=delete");
}
catch(err){
    console.log(err);
}
});
router.get("/blog/edit/:blogid", async function(req, res) {
  try {
    const id = req.params.blogid;

    const blog = await Blog.findByPk(id);
    const cats = await Category.findAll();
    
    //const [cats,] =  await db.execute("select * from categories");
    ///const [blog,] =  await db.execute("select * from blogs where id=?",[id]);
    res.render("admin/blog-edit",{
        title: "update blog : "+blog.title,
        categories : cats ,
        blog:blog 
        
    });
}
catch(err){
    console.log(err);
}
});


router.post("/blog/edit/:blogid", imageUpload.upload.single("image"), async function(req, res) {
  const id = req.body.id;

  const title = req.body.title;
  const description = req.body.description;
  const pre = req.body.pre;
  const home = req.body.home == "on" ? 1:0;
  const verified = req.body.verified == "on"? 1:0;
  const category_id = req.body.categoryid; 
  let image = req.body.image;

    if(req.file) {
      image = req.file.filename;

        fs.unlink('./public/images/' + req.body.image, err => {
            console.log(err);
        });
    }

///console.log([title,description,image,home,verified,category_id,id]);

  try {

    const blog = await Blog.findByPk(id);
    if(blog){
      blog.title = title;
      blog.pre = pre;
      blog.description = description;
      blog.home  = home;
      blog.verified = verified;
      blog.image = image;
      blog.category_id = category_id;
      await blog.save();
      return res.redirect("/admin/blogs?action=update");
    }
    res.redirect("/admin/blogs");
     
  }catch(err){
    console.log(err);
  }
 
});

 


router.get("/blog/create", async function(req, res) {
  try {
    const categories = await Category.findAll();

   // const [cats,] =  await db.execute("select * from categories");
    res.render("admin/blog-create",{
        title: "create a blog",
       categories : categories,
        
    });
}
catch(err){
    console.log(err);
}
});

router.post("/blog/create", imageUpload.upload.single("image"), async function(req, res) {
  const title = req.body.title;
  const description = req.body.description;
  const pre = req.body.pre;
  const image = req.file == null ? '':   req.file.filename ;
  const home = req.body.home == "on" ? 1:0;
  const verified = req.body.verified == "on"? 1:0;
  const category_id = req.body.category_id; 
  
  try {
    
 
    await Blog.create({title:title,description:description,pre:pre,image:image,home:home,verified:verified,category_id:category_id});
       res.redirect("/admin/blogs?action=create");
  }catch(err){
    console.log(err);
  }
});


router.get("/category/create", async function(req, res) {
  try {
    
 
    res.render("admin/category-create",{
        title: "create a category",
        
        
    });
}
catch(err){
    console.log(err);
}
});

router.post("/category/create", async function(req, res) {

  const name = req.body.name;
  
  try {
   // await db.execute("INSERT INTO categories (name) VALUES (?)",[name]);
   await Category.create({name: name});
      res.redirect("/admin/categories?action=create");
  }catch(err){
    console.log(err);
  }
  //console.log(req.body); ///form data

});

router.get("/category/edit/:category_id", async function(req, res) {
  try {
    
    const id = req.params.category_id;
 
 
  const category = await Category.findByPk(id);
 
    res.render("admin/category-edit",{
        title: "update blog : "+category.dataValues.name,
        
        //category:category[0] /// not alis 
        category : category.dataValues
        
    });
}
catch(err){
    console.log(err);
}
});
router.post("/category/edit/:category_id", async function(req, res) {

  const id = req.body.id;
  const name = req.body.name;
  
  try {
    const category = await Category.findByPk(id);
    if(category){
      category.name = name;
     
      await category.save();
      return res.redirect("/admin/categories?action=update");
    }
    res.redirect("/admin/categories");
  }catch(err){
    console.log(err);
  }
  //console.log(req.body); ///form data

});

router.use("/blogs", async function(req, res) { // must add async to use await 

  try {
     // const [blogs,] = await db.execute("select * from blogs ORDER BY id DESC");
     const blogs = await Blog.findAll({ attributes: ["id","title","pre","image"],order:[['id','DESC']] })
     const categories = await Category.findAll();
//console.log(categories.dataValues);
      res.render("admin/blog-list",{
          title: "All blogs",
          blogs : blogs,
          categories:categories.dataValues,
          action : req.query.action,

          selected_category : null
      });
  }
  catch(err){
      console.log(err);
  }
  
 
  });


  router.use("/categories", async function(req, res) { // must add async to use await 

    try {
        //const [categories,] = await db.execute("select * from categories ORDER BY id");
        const categories = await Category.findAll();

        
        res.render("admin/category-list",{
            title: "All Categories",
            categories : categories,
            action : req.query.action,
  
            selected_category : null
        });
    }
    catch(err){
        console.log(err);
    }
    
   
    });

module.exports = router;