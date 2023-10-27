const express = require("express");
const router = express.Router();

const path = require("path");

const db = require("../data/db");


router.use("/blogs/category/:category_id", async function(req, res) {
    const cat_id = req.params.category_id;
    try {
        const [blogs,] = await db.execute("select * from blogs where verified=1 and category_id=?",[cat_id]);
        const [category,] = await db.execute("select * from categories where id=?",[cat_id]);
        const [cats,] = await db.execute("select * from categories");
    
        res.render("users/blogs",{
            title: category[0].name,
            blogs : blogs,
            categories : cats,
            selected_category : cat_id
                });
    }catch(err){
        console.log(err);
       }
    

});
router.use("/blogs/:blogid", async function(req, res) {
   // res.sendFile(path.join(__dirname, "../views/users","blog-details.html"));
   const id = req.params.blogid;
   try{ 
    
    const [blog,]=await db.execute("select * from blogs where id=?",[id]);
   if(blog[0]){
    res.render("users/blog-details",{
        title : "blog detail "+blog[0].title,
        blog : blog[0],

    });

        }

        res.redirect("/");
   }catch(err){
    console.log(err);
   }
    
});

router.use("/blogs", async function(req, res) { // must add async to use await 

try {
    const [blogs,] = await db.execute("select * from blogs where verified=1");
    const [cats,] = await db.execute("select * from categories");
    
    res.render("users/blogs",{
        title: "All shall Fall",
        blogs : blogs,
        categories : cats,
        selected_category : null
    });
}
catch(err){
    console.log(err);
}

    //res.sendFile(path.join(__dirname, "../views/users","blogs.html"));
    //res.render("users/blogs",data);
    // db.execute("select * from blogs where  verified=1")
    // .then(result=>{
    //     db.execute("select * from categories").then(cats => {
    //         res.render("users/blogs",{
    //             title: "All shall Fall",
    //             blogs : result[0],
    //             categories : cats[0]
    //         })
    //     })
    //     .catch(err => console.log(err));
    // })
    // .catch(err => console.log(err))
});

router.use("/", async function(req, res) {


    try {
        const [blogs,] = await db.execute("select * from blogs where verified=1");
        const [cats,] = await db.execute("select * from categories");
        
        res.render("users/index",{
            title: "All shall Fall",
            blogs : blogs,
            categories : cats,
            selected_category : null
        });
    }
    catch(err){
        console.log(err);
    }

    // db.execute("select * from blogs where home=1 and verified=1")
    // .then(result=>{
    //     db.execute("select * from categories").then(cats => {
    //         res.render("users/index",{
    //             title: "new hope",
    //             blogs : result[0],
    //             categories : cats[0]
    //         })
    //     })
    //     .catch(err => console.log(err));
    // })
    // .catch(err => console.log(err))
});
    //res.sendFile(path.join(__dirname, "../views/users","index.html"));
    //res.render("users/index",data);
  

module.exports = router;



// const data = {
//     title: "",
//    // categories: ["Web Geliştirme", "Programlama", "Mobil Uygulamalar", "Veri Analizi", "Ofis Uygulamaları"],
//     // blogs: [
//     //     {
//     //         blogid: 1,
//     //         title: "Komple Uygulamalı Web Geliştirme",
//     //         desc: "Sıfırdan ileri seviyeye 'Web Geliştirme': Html, Css, Sass, Flexbox, Bootstrap, Javascript, Angular, JQuery, Asp.Net Mvc&Core Mvc",
//     //         image: "1.jpeg",
//     //         home: true
//     //     },
//     //     {
//     //         blogid: 2,
//     //         title: "Python ile Sıfırdan İleri Seviye Python Programlama",
//     //         desc: "Sıfırdan İleri Seviye Python Dersleri.Veritabanı,Veri Analizi,Bot Yazımı,Web Geliştirme(Django)",
//     //         image: "2.jpeg",
//     //         home: true
//     //     },
//     //     {
//     //         blogid: 3,
//     //         title: "Sıfırdan İleri Seviye Modern Javascript Dersleri ES7+",
//     //         desc: "Modern javascript dersleri ile (ES6 & ES7+) Nodejs, Angular, React ve VueJs için sağlam bir temel oluşturun.",
//     //         image: "3.jpeg",
//     //         home: false
//     //     },
//     // ]
// }