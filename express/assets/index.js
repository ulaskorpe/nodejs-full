const express = require("express");

const app = express()  ;  // new express app 

app.use(function(request,response){
response.end("hello from the gutter!");
});

app.listen(3000,function(){
    console.log("listening on port 3000");

})