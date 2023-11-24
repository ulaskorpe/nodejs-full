const Category = require("../models/category");
const Blog = require("../models/blog");
const User = require("../models/user");
const Role = require("../models/role");
const faker = require('faker');
const slugField = require("../helpers/slugfield");
const bcrypt = require("bcrypt");
async function populate() {
    const count = await Category.count();

    if(count == 0) { 
       

 const categories =  await Category.bulkCreate([
            { name: "Web Development",url :slugField("Web Development") },
            { name: "Mobil Development" ,url :slugField("Mobil Development")},
            { name: "Programming" ,url :slugField("Programming")},
            { name: "Data Structures",url :slugField("Data Structures") },
            { name: "Beer and fun" ,url :slugField("Beer and fun")},
            { name: "Death Metal",url :slugField("Death Metal") },
            { name: "Black Metal" ,url :slugField("Black Metal")},
            { name: "Doom Metal",url :slugField("Doom Metal") }
        ]);
       

        const array = [12, 23, 31, 43, 54];


        const roles = await Role.bulkCreate([
            {rolename: "admin"},
            {rolename: "moderator"},
            {rolename: "guest"},
        ]);
        const hashed_password = await bcrypt.hash("secret",10);

        var user = await  User.create({
            fullname :"Ulaş Körpe",
            email : "ulaskorpe@gmail.com",
            password : hashed_password
        });
        await user.addRoles(roles[0]);
        
        for(let i = 0  ; i < 10 ; i ++){
            let email = faker.internet.email();
            
          var user = await  User.create({
                fullname :faker.name.findName(),
                email : email.toLowerCase(),
                password : hashed_password
            });
            if(i <5 ){
            //}else if(i>1 && i<8){  
                await user.addRoles(roles[1]);
            }else{
                await user.addRoles(roles[2]);
            }
           

        }

        let k = 1;
        let blog = null ;
        while(k<61){
        for(let i = 0 ; i < categories.length ; i ++){
            let last = Math.floor(Math.random() * 10) + 1;
              
                    for(let j = 0 ; j< last ; j++ ){
                        let title  = faker.lorem.sentence();
                       
                        if(k<61){
                            let home = array.includes(k) ? true : false;
                      blog =  await Blog.create({
                        title: title ,
                        pre: faker.lorem.sentences(2),
                        url :slugField(title),
                        description: faker.lorem.sentences(10),
                        image: k+".jpg",
                        home: home,
                        verified: true,
                        userId: Math.floor(Math.random() * 7) + 1
                           });
                            await categories[i].addBlog(blog);
                             k++;
                         }
                    }///k?
                    }///categories
                    
                 }///while
                
 
        }///if count
       

     
} /// populate function 

module.exports = populate;