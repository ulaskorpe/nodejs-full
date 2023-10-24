var fs = require("fs")   ;

const routeHandler = (request , response )=>{
    if(request.url == '/'){

        fs.readFile("./index.html",(error,html)=>{
            response.writeHead(200,{"Content-Type":"text/html"});
               response.write(html);
               response.end();
              
        });
      
        
    }else if(request.url == '/create' && request.method == 'GET'){
    
        fs.readFile("./create.html",(error,html)=>{
            response.writeHead(200,{"Content-Type":"text/html"});
               response.write(html);
               response.end();
           
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
    
       
       
        
    }else if(request.url == '/blogs'){
    
    
        fs.readFile("./blog.html",(error,html)=>{
            response.writeHead(200,{"Content-Type":"text/html"});
               response.write(html);
               response.end();
           
        });
    
         
    
    }else{
       
        fs.readFile("./404.html",(error,html)=>{
            response.writeHead(404,{"Content-Type":"text/html"});
               response.write(html);
               response.end();
            
        });
    }
    
    
}

/// dışarıya açmak için export 

module.exports = routeHandler;