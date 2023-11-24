const User = require("../models/user");
const bcrypt = require("bcrypt");

const emailService  = require("../helpers/send-email");
const config = require("../config");
const {Op} = require("sequelize");
const crypto = require("crypto");

module.exports.get_register = async function(req, res) {
    const message =  req.session.message;
   
    delete req.session.message;
    const values = req.session.values ;
    delete req.session.values;
    try {
        return res.render("auth/register", {
            title: "register",
             csrfToken : req.csrfToken() ,
            message:message,
            values:values
        });
    }
    catch(err) {
        console.log(err);
    }
}

module.exports.post_register = async function(req, res,next) {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body);
    //const hashed_password = await bcrypt.hash(password,10);
    try {
       // const user = User.findOne({where:{email:email}});
        // if(user){
        //     req.session.message = { text: "email is in use", class: "warning"};
        //     return res.redirect("login");
        // }
        throw new Error("hata oluştu");
 
        const newUser = await User.create({ fullname: name, email: email, password: password });

        emailService.sendMail({
            from : config.email.from,
            to  : newUser.email,
            subject : "new account",
            text :  "accounts have registered"
        });
        return res.redirect("login");
    }
    catch(err) {
       console.log(err.name);
        let msg  = "";
    if(err.name == "SequelizeValidationError" || err.name == "SequlizeUniqueConstraintError"){
        for(let e of err.errors){
                msg+=e.message+" & ";
        }
    }else{
        // msg+= err.message;
        // res.redirect("/500");
        next(err);
    }

    // if(err instanceof Error){
 
       
    //  }

     req.session.message= { text :msg};
     
     req.session.values = { email : email,name:name}
     return  res.redirect("register");
     
 
    }

}


module.exports.get_login = async function(req, res) {
    const message = req.session.message;
    delete req.session.message;
    try {
        return res.render("auth/login", {
            title: "login",
            message : message
           
        });
    }
    catch(err) {
        console.log(err);
    }
}

module.exports.post_login = async function(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    try {

        const user = await User.findOne({
            where: {
                email: email
            }
        });

        if(!user) {
            return res.render("auth/login", {
                title: "login",
                message: { text: "Email error", class: "danger"},
                csrfToken : req.csrfToken()

            });
        }

    //check pw
        const match = await bcrypt.compare(password, user.password);

        if(match) {
            const userRoles = await user.getRoles({
                attributes : ["rolename"],
                raw : true
            });
                ////cookies send via res 
               // res.cookie("isAuth", 1);
                ///session 
                req.session.roles = userRoles.map((role)=>role['rolename']);
                req.session.isAuth = true;
                req.session.full_name = user.fullname;
                req.session.userid = user.id;
            // login successs
            const url = req.query.return_url ? req.query.return_url : "/";
            return res.redirect(url);
        } 
        
        return res.render("auth/login", {
            title: "login",
            message: "password error"
        });     
    }
    catch(err) {
         console.log(err);
       
    }
}

module.exports.post_logout = async function(req, res) {
 
    try {
        //res.clearCookie("isAuth");
       await req.session.destroy(); /// all sessions
       delete req.session.isAuth;
      
            return res.redirect("/");
             
    }
    catch(err) {
        console.log(err);
    }
}

module.exports.get_reset = async function(req, res) {
    const message = req.session.message;
    delete req.session.message;
    try {
        return res.render("auth/reset-password", {
            title: "reset password",
            message: message
        });
    }
    catch(err) {
        console.log(err);
    }
}

module.exports.post_reset = async function(req, res) {
    const email = req.body.email;

    try {
       
        const user = await User.findOne({ where: { email: email }});
        
        if(!user) {
            req.session.message =  { text: "Email not found", class: "danger"};
            return res.redirect("reset-password");
        }
        var token = crypto.randomBytes(32).toString("hex");
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + (1000 * 60 * 60);
        await user.save();

        emailService.sendMail({
            from: config.email.from,
            to: email,
            subject: "Reset Password",
            html: `
                <p>To reset your pw pls use the link below</p>
                <p>
                    <a href="http://localhost:3000/accounts/new-password/${token}">reset password<a/>
                </p>
            `
        });

        req.session.message = { text: "to reset your pw , check your email.", class: "success"};
        res.redirect("login");
    }
    catch(err) {
        console.log(err);
    }
}


module.exports.get_newpassword = async function(req, res) {
    const token = req.params.token;

    try {
        const user = await User.findOne({
            where: {
                resetToken: token,
                resetTokenExpiration: {
                    [Op.gt]: Date.now()
                }
            }
        });

        // if(!user){
        //     res.redirect("/");
        // }

        return res.render("auth/new-password", {
            title: "new password",
            token: token,
            userId: user.id
        });
    }
    catch(err) {
        console.log(err);
    }
}

module.exports.post_newpassword = async function(req, res) {
    const token = req.body.token;
    const userId = req.body.userId;
    const newPassword = req.body.password;

    try {
        const user = await User.findOne({
            where: {
                resetToken: token,
                resetTokenExpiration: {
                    [Op.gt]: Date.now()
                },
                id: userId
            }
        });

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = null;
        user.resetTokenExpiration = null;
        
        await user.save();

        req.session.message = {text: "password updated", class:"success"};
        return res.redirect("login");
    }
    catch(err) {
        console.log(err);
    }
}