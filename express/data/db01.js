const mysql = require("mysql2");
const config = require("../config");
const  Sequelize  = require("sequelize");


const sequelize = new Sequelize(config.db,config.db.user,config.db.password,{
    dialect:"mysql",
    host:config.db.host
});

async function connect(){

try {
    await sequelize.authenticate();
    console.log("connection success");
}catch(err){
    console.log("connection error :",err);
}
}

connect();
module.exports = sequelize;


// promise , async-await => async