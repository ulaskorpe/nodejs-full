const mongoose = require("mongoose");
const logger = require("../middleware/logger");
const config = require("config");
module.exports = function(){
    (async () => {
        try {
            await mongoose.connect(`mongodb://${config.get("db.username")}:${config.get("db.password")}@${config.get("db.host")}:${config.get("db.port")}/${config.get("db.name")}`);
            console.log("connected mongodb");
        }
        catch(err) {
            console.log(err);
        }
    })();
}