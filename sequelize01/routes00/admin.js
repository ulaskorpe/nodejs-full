const express = require("express");
const router = express.Router();

const path = require("path");
const db = require("../data/db");
const fs = require("fs");
const imageUpload = require("../helpers/image-upload");

router.post("/blog/delete/:blogid", async function(req, res) {
  
  try {
    const id = req.params.blogid;
   await db.execute("delete from blogs where id=?",[id]);
     res.redirect("/admin/blogs?action=delete");
}
catch(err){
    console.log(err);
}
});


router.post("/categories/delete/:category_id", async function(req, res) {
  
  try {
    const id = req.params.category_id;
   await db.execute("delete from categories where id=?",[id]);
   await db.execute("UPDATE blogs SET category_id=0 where id=?",[id]);
     res.redirect("/admin/categories?action=delete");
}
catch(err){
    console.log(err);
}
});
router.get("/blog/edit/:blogid", async function(req, res) {
  try {
    const id = req.params.blogid;
    const [cats,] =  await db.execute("select * from categories");
    const [blog,] =  await db.execute("select * from blogs where id=?",[id]);
    res.render("admin/blog-edit",{
        title: "update blog : "+blog[0].title,
        categories : cats,
        blog:blog[0]
        
    });
}
catch(err){
    console.log(err);
}
});


router.post("/blog/edit/:blogid", imageUpload.upload.single("image"), async function(req, res) {
  const id = req.body.id;
  ///const [blog,] =  await db.execute("select * from blogs where id=?",[id]);

  const title = req.body.title;
  const description = req.body.description;
  const pre = req.body.pre;
  //const image = req.file !== null ?  req.file.filename : blog[0].image ;
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
    await db.execute("UPDATE blogs SET title=?,description=?,pre=?,image=?,home=?,verified=?,category_id=? where id=?",[title,description,pre,image,home,verified,category_id,id]);
      res.redirect("/admin/blogs?action=update");
  }catch(err){
    console.log(err);
  }
 
});

 


router.get("/blog/create", async function(req, res) {
  try {
    
    const [cats,] =  await db.execute("select * from categories");
    res.render("admin/blog-create",{
        title: "create a blog",
        categories : cats,
        
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
    
     await db.execute("INSERT INTO blogs (title,description,pre,image,home,verified,category_id) VALUES (?,?,?,?,?,?,?)",[title,description,pre,image,home,verified,category_id]);
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
    await db.execute("INSERT INTO categories (name) VALUES (?)",[name]);
      res.redirect("/admin/categories?action=create");
  }catch(err){
    console.log(err);
  }
  //console.log(req.body); ///form data

});

router.get("/category/edit/:category_id", async function(req, res) {
  try {
    
    const id = req.params.category_id;
 
    const [category,] =  await db.execute("select * from categories where id=?",[id]);
    res.render("admin/category-edit",{
        title: "update blog : "+category[0].name,
        
        category:category[0]
        
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
    await db.execute("UPDATE categories SET name=? WHERE id=?",[name,id]);
      res.redirect("/admin/categories?action=update");
  }catch(err){
    console.log(err);
  }
  //console.log(req.body); ///form data

});

router.use("/blogs", async function(req, res) { // must add async to use await 

  try {
      const [blogs,] = await db.execute("select * from blogs ORDER BY id DESC");
   
      
      res.render("admin/blog-list",{
          title: "All blogs",
          blogs : blogs,
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
        const [categories,] = await db.execute("select * from categories ORDER BY id");
     
        
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