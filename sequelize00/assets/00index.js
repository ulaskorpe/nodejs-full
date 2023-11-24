const express = require("express");

const app = express()  ;  // new express app 

app.use(function(request,response,next){
console.log("midlleware 1")
next();
});


app.use(function(request,response){
    console.log("middleware 2 ")
//    response.end("hello from the gutter -2");
response.send("<h2>HELLOOO</h2>");
    });

app.listen(3000,function(){
    console.log("listening on port 3000");

})