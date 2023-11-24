const mysql = require("mysql2");
const config = require("../config");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
    dialect: "mysql",
    host: config.db.host,
    define: {
        timestamps: false/// cancel timestamps on db level
    },
    storage: "./session.mysql"
 
});

async function connect() {
    try {
        await sequelize.authenticate();
        console.log("connected");
    }
    catch(err) {
        console.log("errror ", err);
    }
}

connect();

module.exports = sequelize;