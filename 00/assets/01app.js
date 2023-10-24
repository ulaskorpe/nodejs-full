//console.log("nodejss");
 var http = require("http");

// function requestListener(request,response){
//     console.log(request.url,request.method);
//     console.log(response.status);
//     response.end();// talep sonlanmalı! 
// }

function getCurrentDateInYmdHis() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so we add 1 and pad with 0 if needed.
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    const ymdHisString = `${year}${month}${day}${hours}${minutes}${seconds}.txt`;
    return ymdHisString;
  }
 //var server = http.createServer(requestListener);
 var server = http.createServer((request,  response )=>{
    //console.log(request.url);
var fs = require("fs")   ;
if(request.url == '/'){

    fs.readFile("./index.html",(error,html)=>{
        response.writeHead(200,{"Content-Type":"text/html"});
           response.write(html);
           response.end();
         //  response.write("<html><head><title>HELLO NODEJS</title></head><body><h1>THIS IS THE WAY!</h1></body></html>");
    });
  
    
}else if(request.url == '/create' && request.method == 'GET'){

    fs.readFile("./create.html",(error,html)=>{
        response.writeHead(200,{"Content-Type":"text/html"});
           response.write(html);
           response.end();
         //  response.write("<html><head><title>HELLO NODEJS</title></head><body><h1>THIS IS THE WAY!</h1></body></html>");
    });
}else if(request.url == '/create' && request.method == 'POST'){
    const data = [];
        request.on("data",(chunk)=>{
           // console.log(chunk);
           data.push(chunk);
        });

        request.on("end",()=>{
            const result = Buffer.concat(data).toString();
            
            const parsedData = result.split("=")[1];
            console.log(parsedData);


            fs.appendFile('posts.txt',parsedData,(err)=>{
                if(err){
                    console.log(err);
                }else{
                    response.statusCode = 302 ; //redirect code
                    response.setHeader("Location","/");
                    response.end();
                }
            });

        });

    // /fs.appendFile(getCurrentDateInYmdHis(),"this is your life",(err)=>{
   
    
}else if(request.url == '/blogs'){


    fs.readFile("./blog.html",(error,html)=>{
        response.writeHead(200,{"Content-Type":"text/html"});
           response.write(html);
           response.end();
         //  response.write("<html><head><title>HELLO NODEJS</title></head><body><h1>THIS IS THE WAY!</h1></body></html>");
    });

     
   // response.write("<html><head><title>HELLO BLOG</title></head><body><h1>THIS IS THE BLOG WAY!</h1></body></html>");
}else{
   
    fs.readFile("./404.html",(error,html)=>{
        response.writeHead(404,{"Content-Type":"text/html"});
           response.write(html);
           response.end();
         //  response.write("<html><head><title>HELLO NODEJS</title></head><body><h1>THIS IS THE WAY!</h1></body></html>");
    });
}

// talep sonlanmalı! 

    // response.setHeader("Content-Type","text/html");
    // response.statusCode=200;
    // response.statusMessage="ok";
    // response.write("<h1>home-page</h1>");
    // console.log(request.url,request.method);
    // console.log(response.statusCode);
    
 });

 server.listen(3000);

 console.log("server at 3000");