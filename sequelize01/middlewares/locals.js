module.exports = function(req,res,next){ /// this is a middleware fills all the responses with re.session.isAuth if exists
    res.locals.isAuth = req.session.isAuth;
    res.locals.full_name = req.session.full_name;
    res.locals.isAdmin = req.session.roles ? req.session.roles.includes("admin"):false;
    res.locals.isModerator = req.session.roles ? req.session.roles.includes("moderator"):false;
  //  res.locals.csrfToken =  req.csrfToken() ;
    next(); //// next is must in middlewares 
}