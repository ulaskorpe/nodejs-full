 
const Blog = require("../models/blog");
const Category = require("../models/category");


const {Op} = require("sequelize");

 
module.exports.blogs_details = async function(req, res) {
// res.sendFile(path.join(__dirname, "../views/users","blog-details.html"));
//const id = req.params.blogid;
const slug = req.params.slug;
try{ 
    
//const blog = await Blog.findByPk(id);
const blog = await Blog.findOne({
    where:{
        url:slug
    }
});
if(blog){ 
    res.render("users/blog-details",{
        title : "blog detail "+blog.title,
        blog : blog,
        //isAuth : req.session.isAuth

    });

        }else{

      res.redirect("/404");
    }
}catch(err){
    console.log(err);
}
    
}

module.exports.blogs_list = async function(req, res) { // must add async to use await 

const size = 15;
const { page = 0 } = req.query    ;
const slug = req.params.slug;

try {
    const {rows,count} = await Blog.findAndCountAll(
        { attributes: ["id","title","pre","image","url"],
           order:[['id','DESC']],
           where:{verified:{[Op.eq]:true}},
           include:  
            {
              model: Category,
              attributes: [],
              through: { attributes: [] }, // Exclude any through table attributes
            },  
            include: slug ? {model:Category, where : {url:slug}}: null,
            raw:true,
            limit : size,
            offset : page*size
    });

 
    const cats = await Category.findAll({raw:true});
    
    res.render("users/blogs",{
        title: "BLOGS",
        blogs : rows,
        total_items :count,
        total_pages : Math.ceil( count /size ),
        current_page : page,
        categories : cats,
        selected_category : slug,
      //  isAuth : req.session.isAuth

    });
}
catch(err){
    console.log(err);
}

        
}

module.exports.index = async function(req, res) {
//console.log(req.cookies);

    const blogs = await Blog.findAll(
        { attributes: ["id","title","pre","image","url"],
           order:[['id','DESC']],
           where:{
                   [Op.and]:{
                        verified:true,home:true 
                }
           },
           include:  
            {
              model: Category,
              attributes: [],
              through: { attributes: [] }, // Exclude any through table attributes
            },  
           
            raw:true,
          
    });

    // const blogs = await Blog.findAll(
    //     { attributes: ["id","title","pre","image","url"],
    //     order:[['id','DESC']],
    //     include : Category,where:{
    //     [Op.and]:{
    //         verified:true,home:true 
    //     },
       
    // } ,raw:true})


    const categories = await Category.findAll();
    
    res.render("users/index",{
                title: "All shall Fall",
                blogs : blogs,
                categories : categories ,
                selected_category : null,
                csrfToken : req.csrfToken() 
               // isAuth : req.session.isAuth 
             //   isAuth : req.cookie.isAuth
            });
        
}