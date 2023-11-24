const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
    const token = req.header("x-auth-token");
    if(!token) {
        return res.status(401).send("not authorized");
    }

    try {
        const decodedToken = jwt.verify(token, config.get("auth.jwtPrivateKey"));
        req.user = decodedToken;
        next();
    }
    catch(ex) {
        res.status(400).send("token error");
    }
}