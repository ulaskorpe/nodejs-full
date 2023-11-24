const Blog = require("../models/blog");
const Category = require("../models/category");
const Role = require("../models/role");
const User = require("../models/user");
const {Op} = require("sequelize");
const sequelize = require("../data/db");
const slugField = require("../helpers/slugfield");
const fs = require("fs");

module.exports.post_category_blog_remove = async function(req, res) {

    try {
    const blog_id = req.body.blog_id;
    const category_id = req.body.category_id;
    
    const blog = await Blog.findByPk(blog_id);
    const category = await Category.findByPk(category_id);
    await blog.removeCategory(category);

        // await sequelize.query(`delete from blogCategories where blogId=${blog_id} and categoryId=${category_id}`);
 
    return res.redirect("/admin/category/edit/"+category_id+"?action=delete");
    }
    catch(err){
    console.log(err);
    }
    };

module.exports.post_blog_delete = async function(req, res) {

try {
const id = req.params.blogid;
const userId = req.session.userid;
const isAdmin = req.session.roles.includes("admin");
//const blog = await Blog.findOne({
//where : isAdmin ? {id:id} : { id : id, userId : userId}, 
const blog = await  Blog.findOne(
    {
        where : isAdmin ? {id:id} : { id : id, userId : userId}, 
    
    }
    
    
    ) ; //Blog.findByPk(id);

if(blog.image) {
fs.unlink('./public/images/' + blog.image, err => {
    console.log(err);
});
}
blog.destroy(); //// auto deletes relations too
//await sequelize.query(`delete from blogCategories where blogId=${blog_id}`);
//  await db.execute("delete from blogs where id=?",[id]);
return res.redirect("/admin/blogs?action=delete");
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
 
return res.redirect("/admin/categories?action=delete");
}
catch(err){
console.log(err);
}
}

module.exports.get_blog_edit = async function(req, res) {
try {
const id = req.params.blogid;
const userId = req.session.userid;
const isAdmin = req.session.roles.includes("admin");
const blog = await Blog.findOne({
where : isAdmin ? {id:id} : { id : id, userId : userId}, 


include :{ model : Category , attributes :["id"] }

});
const cats = await Category.findAll();


res.render("admin/blog-edit",{
title: "update blog : "+blog.title,
categories : cats ,
blog:blog , 
 
//isAuth : req.session.isAuth

});
}
catch(err){
console.log(err);
}
}

module.exports.post_blog_edit = async function(req, res) {
const id = req.body.id;
const isAdmin = req.session.roles.includes("admin");
const title = req.body.title;
const description = req.body.description;
const pre = req.body.pre;
const home = req.body.home == "on" ? 1:0;
const verified = req.body.verified == "on"? 1:0;
//const category_id = req.body.category_id; 
const categoryIds = req.body.categories;
const userId = req.session.userid;
let image = req.body.image;
console.log(categoryIds);
if(req.file) {
image = req.file.filename;

fs.unlink('./public/images/' + req.body.image, err => {
    console.log(err);
});
}


try {

const blog = await Blog.findOne({
    where : isAdmin ? {id:id} : { id : id, userId : userId}, 

    include:{
        model:Category,
        attributes:["id"]
    }
});
if(blog){
blog.title = title;
blog.pre = pre;
blog.description = description;
blog.home  = home;
blog.verified = verified;
blog.image = image;
await blog.removeCategories(blog.categories);///blog must be selected with categories to removeCategories
if(categoryIds != undefined){
    const selectedCategories = await Category.findAll({
        where: {
            id:{
                [Op.in] : categoryIds
            }
        }
    });
    await blog.addCategories(selectedCategories);
 
}
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

const message = req.session.message;
    delete req.session.message;
const values = req.session.values ;
    delete req.session.values;
    //console.log(values);
// const [cats,] =  await db.execute("select * from categories");
res.render("admin/blog-create",{
title: "create a blog",
categories : categories,
 message : message,
 values : values 
//isAuth : req.session.isAuth
});
}
catch(err){
console.log(err);
}
}

module.exports.post_blog_create = async function(req, res) {
const categoryIds = req.body.categories;
const title = req.body.title;
const description = req.body.description;
const pre = req.body.pre;
const image = req.file == null ? '':   req.file.filename ;
const home = req.body.home == "on" ? 1:0;
const verified = req.body.verified == "on"? 1:0;
const userId = req.session.userid;
///const category_id = req.body.category_id; 

try {
    let error_message = "";
    if(title == ""){
        error_message+="title cant be empty";
        throw new Error(error_message);
    }

    if(title.length < 5 || title.length > 20 ){
        error_message+="title must be 5 - 20 chars";
        throw new Error(error_message);
  
    }

    if(description.length < 5 || title.length > 20 ){
        error_message+="plz define a description";
        throw new Error(error_message);
  
    }
const blog = await Blog.create({title:title,url:slugField(title),description:description,pre:pre,image:image,home:home,verified:verified,userid:userId});



if(categoryIds != undefined){
    const selectedCategories = await Category.findAll({
        where: {
            id:{
                [Op.in] : categoryIds
            }
        }
    });
    await blog.addCategories(selectedCategories);
 
}
return res.redirect("/admin/blogs?action=create");
}catch(err){
 
if(err instanceof Error){
 
       req.session.message= { text :err.message};
        req.session.values = { title : title , pre:pre , description : description , image: image, categoryIds: categoryIds , home :home ,verified:verified}
      return  res.redirect("/admin/blog/create");
    }
}
}

module.exports.get_category_create = async function(req, res) {
try {


res.render("admin/category-create",{
title: "create a category", 
 
//isAuth : req.session.isAuth

});
}
catch(err){
console.log(err);
}
}

module.exports.post_category_create = async function(req, res) {

const name = req.body.name;

try {

await Category.create({name: name,url:slugField(name)});
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
count_blogs : count_blogs,
action : req.query.action 
//isAuth : req.session.isAuth
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
category.url = slugField(name)

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
    const userid = req.session.userid;
    const isModerator = req.session.roles.includes("moderator");
    const isAdmin = req.session.roles.includes("admin");
try {
const blogs = await Blog.findAll({ //// thats eager loading 
    attributes: ["id","title","pre","image"],
    order:[['id','DESC']] ,
 //   include : Category  /// takes all data
    include : { 
        model: Category,
        attributes : ["name"]
    },
    where: isModerator && !isAdmin ? { userId: userid } : null

})
const categories = await Category.findAll();
res.render("admin/blog-list",{
    title: "All blogs",
    blogs : blogs, 
    
    categories:categories.dataValues,
    action : req.query.action,
  //  isAuth : req.session.isAuth,
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
   //     isAuth : req.session.isAuth,
        selected_category : null
    });
}
catch(err){
    console.log(err);
}


}


module.exports.get_roles = async function(req, res) {
    try {
        const roles = await Role.findAll({
            attributes: {
                include: ['roles.id','roles.rolename',[sequelize.fn('COUNT', sequelize.col('users.id')), 'user_count']]
            },
            include: [
                {model: User, attributes:['id'] }
            ],
            group: ['roles.id'],
            raw: true,
            includeIgnoreAttributes: false
        });

        res.render("admin/role-list", {
            title: "role list",
            roles: roles
        });
    }
    catch(err) {
        console.log(err);
    }
}



module.exports.get_role_edit = async function(req, res) {
    const roleid = req.params.roleid;
    try {
       const role = await Role.findByPk(roleid);
       const users = await role.getUsers();
       if(role) {
        return res.render("admin/role-edit", {
            title: role.rolename,
            role: role,
            users: users
        });
       }

      return res.redirect("admin/roles");
    }
    catch(err) {
        console.log(err);
    }
}

module.exports.post_role_edit = async function(req, res) {
    const roleid= req.body.roleid;
    const rolename= req.body.rolename;
    try {
       await Role.update({ rolename: rolename }, {
        where: {
            id: roleid
        }
       });
       return res.redirect("/admin/roles");
    }
    catch(err) {
        console.log(err);
    }
}

module.exports.roles_remove = async function(req, res) {
    const roleid= req.body.roleid;
    const userid= req.body.userid;
    console.log(roleid, userid);

    try {
       await sequelize.query(`delete from userRoles where userId=${userid} and roleId=${roleid}`);
       return res.redirect("/admin/roles/" + roleid);
    }
    catch(err) {
        console.log(err);
    }
}


module.exports.get_users = async function(req,res) {
    try {
       const users = await User.findAll({
        attributes: ["id","fullname","email"],
        include: {
            model: Role,
            attributes: ["rolename"]
        }
       });

       res.render("admin/user-list", {
        title: "user list",
        users: users
       })
     }
     catch(err) {
         console.log(err);
     }
}


module.exports.get_user_edit = async function(req,res) {
    const userid = req.params.userid;
    try {
        const user = await User.findOne({
            where: { id :userid },  
            include: { model: Role, attributes: ["id"] }
        });

        const roles = await Role.findAll();

        res.render("admin/user-edit", {
            title: "user edit",
            user: user,
            roles: roles
        });
     }
     catch(err) {
         console.log(err);
     }
}

module.exports.post_user_edit = async function(req,res) {
    const userid = req.body.userid;
    const fullname = req.body.fullname
    const email = req.body.email;
    const roleIds =  req.body.roles; ///req.body['roles[]'];
    // if (!Array.isArray(roleIds)) {
    //     roleIds = [roleIds]; // Convert to an array with a single element
    //   }
    
    try {
        const user = await User.findOne({
            where: { id :userid },  
            include: { model: Role, attributes: ["id"] }
        });

        if(user) {
            user.fullname = fullname;
            user.email = email;
            await user.removeRoles(user.roles);
            if(roleIds != undefined) {
                const selectedRoles = await Role.findAll({
                    where: {
                        id: {
                            [Op.in]: roleIds
                        }
                    }
                });
                await user.addRoles(selectedRoles);
            }
          
            await user.save();
            return res.redirect("/admin/users/"+user.id);
        }
        return res.redirect("/admin/users");
     }
     catch(err) {
         console.log(err);
     }
}


