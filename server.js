const express = require("express");
var app = require('express')();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var path = require("path");
var PORT = process.env.PORT || 3001;



//https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css
app.use(express.static(`${__dirname}/client`));
// Testing to see if server can operate correctly
app.get('/', function(req,res) {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});


var clients = 0;
var roomno = 1;



//Whenever someone connects this gets executed
users = [];
io.on('connection', function(socket) {
   console.log('A user connected');
   socket.on('setUsername', function(data) {
      console.log("User "+data + " has connected!");
      if(users.indexOf(data) > -1) {
         socket.emit('userExists', data + ' username is taken! Try some other username.');
      } else {
         users.push(data);
         socket.emit('userSet', {username: data});
      }
   });

   socket.on('msg', function(data) {
      //Send message to everyone
      io.sockets.emit('newmsg', data);
   })
});

//
// users = [];
//   io.on('connection', function(socket) {
//      console.log('A user connected');
//      //clients++;
//
//      socket.on('setUsername', function(data) {
//         console.log("User "+data+" has connected!");
//         if(users.indexOf(data) > -1) {
//            socket.emit('userExists', data + ' username is taken! Try some other username.');
//         } else {
//            users.push(data);
//            socket.emit('userSet', {username: data});
//         }
//      });
//
//      socket.on('msg', function(data) {
//    //Send message to everyone
//    io.sockets.emit('newmsg', data);
// })
//      //Whenever someone disconnects this piece of code executed
//      socket.on('disconnect', function () {
//         clients--;
//         socket.broadcast.emit('newclientconnect', {description: clients + ' clients connected'});
//         console.log('A user disconnected');
//      });
//   });

http.listen(PORT, function() {
  console.log(`Server started on port: ${PORT}`);
});
