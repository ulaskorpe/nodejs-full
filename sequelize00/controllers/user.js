 
const Blog = require("../models/blog");
const Category = require("../models/category");


const {Op} = require("sequelize");

module.exports.blogs_by_category= async function(req, res) {
    const cat_id = req.params.category_id;
    try {

       

        const blogs = await Blog.findAll({where:{[Op.and]:[
            {
                verified:true,categoryId: cat_id
            }]
            } /// op obj
        , raw :true }) ;
       const cats = await Category.findAll();
       const category = await Category.findByPk(cat_id);
        
        res.render("users/blogs",{
            title:  category.name,
            blogs : blogs,
            categories : cats,
            selected_category : cat_id
                });
    }catch(err){
        console.log(err);
       }
    

}

module.exports.blogs_details = async function(req, res) {
// res.sendFile(path.join(__dirname, "../views/users","blog-details.html"));
const id = req.params.blogid;
try{ 
    
const blog = await Blog.findByPk(id);
if(blog.id){ 
    res.render("users/blog-details",{
        title : "blog detail "+blog.title,
        blog : blog,

    });

        }

        res.redirect("/");
}catch(err){
    console.log(err);
}
    
}

module.exports.blogs_list = async function(req, res) { // must add async to use await 

try {
    const blogs = await Blog.findAll(
        { attributes: ["id","title","pre","image"],
           order:[['id','DESC']],
           where:{verified:true},
           include : Category,raw:true
    });
    console.log(blogs);


    const cats = await Category.findAll();
    
    res.render("users/blogs",{
        title: "BLOGS",
        blogs : blogs,
        categories : cats,
        selected_category : null
    });
}
catch(err){
    console.log(err);
}

        
}

module.exports.index = async function(req, res) {

    const blogs = await Blog.findAll({ attributes: ["id","title","pre","image"],order:[['id','DESC']],include : Category,where:{
        [Op.and]:{
            verified:true,home:true 
        },
       // include : Category
    } ,raw:true})


    const categories = await Category.findAll();
    
    res.render("users/index",{
                title: "All shall Fall",
                blogs : blogs,
                categories : categories ,
                selected_category : null
            });
        
}