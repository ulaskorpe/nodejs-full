module.exports = (req, res, next) => {
    if(!req.session.isAuth) {
        return res.redirect("/accounts/login?return_url="+req.originalUrl);
    }
    next();
}