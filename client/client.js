
var usersList = [];
var myNick = "";

var socket = io();

socket.on("connect", function(e){
  socket.emit("start");
});

socket.on('nick', function(nick){
  myNick=nick;
});

$('form').submit(function(){
  var temp = [myNick , $("#boxMessage").val()];
  socket.emit("send chat message", temp);
  $("#boxMessage").val("");
  return false;
});

socket.on('chat message', function(msg){
  $("#messages").append("<li><b>"+msg[0]+":</b> "+msg[1]);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('info', function(inf){
  $('#messages').append('<li><i>' + inf + '</i></li>');
});

socket.on('users list', function(usersList){
    updateUserList(usersList);
});


function setMyName(){
  myNick = document.getElementById("boxNick").value;
  socket.emit("set nick", myNick);
  document.getElementById("boxNick").disabled=true;
  document.getElementById("buttonNick").hidden=true;
  document.getElementById("boxMessage").disabled=false;
  document.getElementById("buttonMessage").disabled=false;
}

function updateUserList(u){
  var list = document.getElementById("ulist");
  list.innerHTML = "";

  for (var i = 0; i < u.length; i++ ) {
      var item = document.createElement("li");
      item.innerHTML = u[i];
      list.appendChild(item);
  }
}

document.addEventListener("DOMContentLoaded", function() {
   var mouse = {
      click: false,
      move: false,
      pos: {x:0, y:0},
      pos_prev: false
   };
   // get canvas element and create context
   var canvas  = document.getElementById('drawing');
   var context = canvas.getContext('2d');
   var width   = window.innerWidth;
   var height  = window.innerHeight;
   var socket  = io.connect();

   // set canvas to full browser width/height
   canvas.width = width;
   canvas.height = height;

   // register mouse event handlers
   canvas.onmousedown = function(e){ mouse.click = true; };
   canvas.onmouseup = function(e){ mouse.click = false; };

   canvas.onmousemove = function(e) {
      // normalize mouse position to range 0.0 - 1.0
      mouse.pos.x = e.offsetX / width;
      mouse.pos.y = e.offsetY / height;
      mouse.move = true;
   };

   // draw line received from server
	socket.on('draw_line', function (data) {
      var line = data.line;
      context.beginPath();
      context.moveTo(line[0].x * width, line[0].y * height);
      context.lineTo(line[1].x * width, line[1].y * height);
      context.stroke();
   });

   // main loop, running every 25ms
   function mainLoop() {
      // check if the user is drawing
      if (mouse.click && mouse.move && mouse.pos_prev) {
         // send line to to the server
         socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev ] });
         mouse.move = false;
      }
      mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
      setTimeout(mainLoop, 25);
   }
   mainLoop();
});
