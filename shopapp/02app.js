
const config = require("config");
const express = require("express");
const app = express();



require("./startup/routes")(app);

// process.on("uncaughtException",(err)=>{
//     console.log(err.message);
//     logger.error(err.message);
// })
// process.on("unhandledRejection",(err)=>{
//     console.log(err.message);
//     logger.error(err.message);
// })
//throw new Error("uncaught exception *** ");


// const  p =   Promise.reject(new Error("errorr 3 "))

// p.then(()=>console.log("sucess")).catch(err=>console.log(err.message));



//console.log(config.get("auth.jwtPrivateKey"));

//console.log(process.env.NODE_ENV);
//console.log(app.get("env"));

const selected_port = process.env.PORT || 3000;

app.listen(selected_port, () => {
    console.log("listening on port "+selected_port);
});