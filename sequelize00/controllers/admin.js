const Blog = require("../models/blog");
const Category = require("../models/category");
const {Op} = require("sequelize");


const fs = require("fs");

module.exports.post_blog_delete = async function(req, res) {

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
};

module.exports.post_category_delete = async function(req, res) {

try {
const id = req.params.category_id;


 const cat = Category.findByPk(id);

//  try {
//  await cat.removeBlogs();
// }catch(err){
//     return console.log(err);
// }
// await Blog.update({category_id : 0},{where : { ////related data deleted automaticaly

// category_id:id

// }});
await  Category.destroy({
where: { id : id }
})
 
res.redirect("/admin/categories?action=delete");
}
catch(err){
console.log(err);
}
}

module.exports.get_blog_edit = async function(req, res) {
try {
const id = req.params.blogid;

const blog = await Blog.findByPk(id);
const cats = await Category.findAll();


res.render("admin/blog-edit",{
title: "update blog : "+blog.title,
categories : cats ,
blog:blog 

});
}
catch(err){
console.log(err);
}
}

module.exports.post_blog_edit = async function(req, res) {
const id = req.body.id;

const title = req.body.title;
const description = req.body.description;
const pre = req.body.pre;
const home = req.body.home == "on" ? 1:0;
const verified = req.body.verified == "on"? 1:0;
const category_id = req.body.category_id; 
let image = req.body.image;

if(req.file) {
image = req.file.filename;

fs.unlink('./public/images/' + req.body.image, err => {
    console.log(err);
});
}


try {

const blog = await Blog.findByPk(id);
if(blog){
blog.title = title;
blog.pre = pre;
blog.description = description;
blog.home  = home;
blog.verified = verified;
blog.image = image;
blog.categoryId = category_id;
await blog.save();
return res.redirect("/admin/blogs?action=update");
}
res.redirect("/admin/blogs");

}catch(err){
console.log(err);
}

}

module.exports.get_blog_create = async function(req, res) {
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
}

module.exports.post_blog_create = async function(req, res) {
const title = req.body.title;
const description = req.body.description;
const pre = req.body.pre;
const image = req.file == null ? '':   req.file.filename ;
const home = req.body.home == "on" ? 1:0;
const verified = req.body.verified == "on"? 1:0;
const category_id = req.body.category_id; 

try {


await Blog.create({title:title,description:description,pre:pre,image:image,home:home,verified:verified,categoryId:category_id});
res.redirect("/admin/blogs?action=create");
}catch(err){
console.log(err);
}
}

module.exports.get_category_create = async function(req, res) {
try {


res.render("admin/category-create",{
title: "create a category",


});
}
catch(err){
console.log(err);
}
}

module.exports.post_category_create = async function(req, res) {

const name = req.body.name;

try {

await Category.create({name: name});
res.redirect("/admin/categories?action=create");
}catch(err){
console.log(err);
}


}

module.exports.get_category_edit = async function(req, res) {
try {

const id = req.params.category_id;

////these 3 are lazy loading 
const category = await Category.findByPk(id);

 const blogs = await category.getBlogs(); ///auto generates this related function 
 ///https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
const count_blogs = await category.countBlogs();
////these 3 are lazy loading 

res.render("admin/category-edit",{
title: "update blog : "+category.dataValues.name,

//category:category[0] /// not alis 
category : category.dataValues,
blogs : blogs,
count_blogs : count_blogs

});
}
catch(err){
console.log(err);
}
}

module.exports.post_category_edit = async function(req, res) {

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

}

module.exports.get_blogs = async function(req, res) { // must add async to use await 

try {
const blogs = await Blog.findAll({ //// thats eager loading 
    attributes: ["id","title","pre","image"],
    order:[['id','DESC']] ,
 //   include : Category  /// takes all data
    include : { 
        model: Category,
        attributes : ["name"]
    }

})
const categories = await Category.findAll();
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


}

module.exports.get_categories = async function(req, res) { // must add async to use await 

try {
    
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


}