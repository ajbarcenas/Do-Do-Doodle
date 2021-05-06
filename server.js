const express = require("express")
var app = require('express')();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var path = require("path");
var ip = require("ip");
var PORT = process.env.PORT || 3000;


var clients = [];
var increment = 1;
var line_history = [];

//https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css

app.use(express.static(`${__dirname}/client`));
// Testing to see if server can operate correctly
app.get('/', function(req,res) {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});


function getUsersList(){
  var usersList = [];
    for (var i = 0; i < clients.length; i++){
      usersList[i] = clients[i].n;
    }
  return usersList;
}




app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  clients.push(socket);

  socket.on('start', function(){
    socket.emit('nick', "guest"+increment);
    clients[clients.indexOf(socket)].n = "guest"+increment;
    increment++;
    io.emit('users list', getUsersList());
  });

  socket.on('send chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('set nick', function(nick){
    io.emit('info', "New user: " + nick);
    clients[clients.indexOf(socket)].n = nick;
    io.emit('users list', getUsersList());
  });


  socket.on('disconnect', function() {
    if( clients[clients.indexOf(socket)].n == null ){
    }
    else{
      io.emit('info', "User " + clients[clients.indexOf(socket)].n + " disconnected.");
    }
    clients.splice(clients.indexOf(socket),1);//clientIndex, 1);
    io.emit('users list', getUsersList());
   });

   // first send the history to the new client
for (var i in line_history) {
   socket.emit('draw_line', { line: line_history[i] } );
}

// add handler for message type "draw_line".
socket.on('draw_line', function (data) {
   // add received line to history
   line_history.push(data.line);
   // send line to all clients
   io.emit('draw_line', { line: data.line });
});

socket.on('clearit', function(){
  line_history = [];
  io.emit('clearit', true);
  });


});

http.listen(PORT, function() {
  console.log(`Server started on port: ${PORT}`);
});
