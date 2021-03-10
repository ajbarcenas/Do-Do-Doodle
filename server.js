const express = require("express");
var app = express();
var http = require("http").createServer(app);
const ws = require("ws");
var PORT = process.env.PORT || 3001;
//https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css
app.use(express.static(`${__dirname}/client`));

// Testing to see if server can operate correctly
app.get('/', function(req,res,next) {
  res.send("Hello World");
})

// const wsServer = new ws.Server({noServer: true});
// wsServer.on('connection', socket => {
//   socket.on('message', message => console.log(message));
// });


//const server = app.listen(3001);
http.listen(PORT, function() {
  console.log(`Server started on port: ${PORT}`);
});
// server.on('upgrade', (request, socket, head) =>{
//   wsServer.handleUpgrade(request, socket, head, socket => {
//     wsServer.emit('connection', socket, request);
//   });
// });
