module.exports = (req, res, next) => {
    if(!req.session.isAuth) {
        return res.redirect("/accounts/login?return_url="+req.originalUrl);
    }


    if(!req.session.roles.includes("admin")) {
        req.session.message = {text:"you have no right"}
        return  res.redirect("/accounts/login?returnUrl="+req.originalUrl);
    }
    next();
}