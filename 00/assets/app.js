var http = require("http");

const routes = require("./routes");

var server = http.createServer(routes);

server.listen(3000);

console.log("server at 3000");