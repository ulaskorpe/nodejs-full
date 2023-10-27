const mysql = require("mysql2");
const config = require("../config");
let connection = mysql.createConnection(config.db);
connection.connect(function(err){
    if(err){
        return  console.log(err);
    }

    console.log("connection success");

});

module.exports  = connection.promise();

// promise , async-await => async