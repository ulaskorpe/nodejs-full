const express = require("express");

const app = express()  ;  // new express app 

const path = require("path");

const parentDirectory = path.join(__dirname, '..');

app.use("/libs", express.static("node_modules"));
app.use("/static",express.static("public"));

app.use("/blogs/:blogid",function(request,response){
  //  console.log(request.params);
//   console.log(__dirname);
//   console.log(__filename);
   // response.send("blog-detail");
    response.sendFile( path.join( parentDirectory,"views/users","blog-details.html"));
});

app.use("/blogs",function(request,response){
    //response.send("blogs");
    response.sendFile( path.join( parentDirectory,"views/users","blogs.html"));
});

app.use("/",function(request,response){
    //response.send("home");
    response.sendFile( path.join( parentDirectory,"views/users","index.html"));
})

app.listen(3000,function(){
    console.log("listening on port 3000");

})