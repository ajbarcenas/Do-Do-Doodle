var myNick = "";

var socket = io();

// get canvas element and create context
var canvas  = document.getElementById('drawing');
var context = canvas.getContext('2d');
var width   = 1200;
var height  = 550;

//set strokeWidth
var strokeWidth = 5;
$('#myslider').attr({min:1, max:25}).val(strokeWidth);

// set canvas to full browser width/height
canvas.width = width;
canvas.height = height;
canvas.style.border = '5px solid black';

function setMyName(){
  myNick = document.getElementById("boxNick").value;
  socket.emit("set nick", myNick);
  document.getElementById("boxNick").disabled=true;
  document.getElementById("buttonNick").hidden=true;
  document.getElementById("boxMessage").disabled=false;
  document.getElementById("buttonMessage").disabled=false;
}

function updateUserList(u){
  let list = document.getElementById("ulist");
  list.innerHTML = "";

  for (var i = 0; i < u.length; i++ ) {
      let {name, isArtist, isCorrect, isReady, isDisabled} = u[i];
      let color = 'black';
      let item = document.createElement("li");

      if (isArtist) {
        color = 'cyan';
      } else if (isCorrect) {
        color = 'green';
      } else if (isDisabled) {
        color = 'red';
      }

      item.innerHTML = `<span style="color: ${color}">${name}${isReady ? "&#10003" : ""}</span>`;

      list.appendChild(item);
  }
}

var mouse = {
  click: false,
  pos: {},
  pos_prev: {},
};

// register mouse event handlers
canvas.onmousedown = function(e){
  mouse.click = true;
  mouse.pos_prev = {
    // normalize mouse position to range 0.0 - 1.0
    x: e.offsetX / canvas.width,
    y: e.offsetY / canvas.height
  };
};

canvas.onmouseup = function(e){
  mouse.click = false;
};

canvas.onmousemove = function(e) {
    // check if the user is drawing
    if (mouse.click) {
      // normalize mouse position to range 0.0 - 1.0
      mouse.pos = {
        x: e.offsetX / canvas.width,
        y: e.offsetY / canvas.height
      };

      // send line to to the server
      socket.emit('draw_line', {
        line: [ mouse.pos, mouse.pos_prev ],
        color: document.getElementById("colorsMain").options[document.getElementById("colorsMain").selectedIndex].text,
        strokeWidth: strokeWidth
      });
    }

    mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
};

socket.on('chat message', function(msg){
  $("#messages").append("<li><b>"+msg[0]+":</b> "+msg[1]);
  $('#msgContainer').scrollTop($('#msgContainer')[0].scrollHeight)
});

socket.on('info', function(inf){
  $('#messages').append('<li><i>' + inf + '</i></li>');
});

socket.on('users list', function(usersList){
    updateUserList(usersList);
});

//store all lines from the server
socket.on('lines', function(lines) {
  context.clearRect(0, 0,  canvas.width, canvas.height);

  context.lineCap = 'round';

  //draw the currently stored lines
  for (let i = 0; i < lines.length; i++) {
    let {color, strokeWidth, line} = lines[i];
    context.strokeStyle = color;
    context.lineWidth = strokeWidth;

    context.beginPath();
    context.moveTo(Math.round(line[0].x * canvas.width), Math.round(line[0].y * canvas.height));
    context.lineTo(Math.round(line[1].x * canvas.width), Math.round(line[1].y * canvas.height));
    context.stroke();
  }
});

socket.on('draw_line', function(data) {
  let {color, strokeWidth, line} = data;
  context.strokeStyle = color;
  context.lineWidth = strokeWidth;
  context.lineCap = 'round';

  context.beginPath();
  context.moveTo(Math.round(line[0].x * canvas.width), Math.round(line[0].y * canvas.height));
  context.lineTo(Math.round(line[1].x * canvas.width), Math.round(line[1].y * canvas.height));
  context.stroke();
});

socket.on('time', function(data) {
  let timer = document.getElementById("timer");
  if (data.done) {
    timer.innerHTML = `<span style="color: black">Done!</span>`;
  } else {
    timer.innerHTML = `<span style="color: black">${data.timeLeft}s</span>`;
  }
});

socket.on('word', function(word) {
  alert(`Draw '${word}'`);
});

/*
var choice = Math.floor(Math.random()*22);
var answer = words[choice];
var myLength = answer.length;

let game = document.getElementById("game");
let submitButton =document.getElementById("submitGuess");
let newGameButton = document.getElementById("newGame");
let result = document.getElementById("result");

submitButton.addEventListener('click', function() {
  let userGuess = document.getElementById("guessField").value;
  console.log(answer);

  if(userGuess == answer){
    result.innerText = "Correct!";
    game.style.backgroundColor = '#66ff75';
  }
  else{
    result.innerText = "Incorrect!";
    result.style.color = "black";
    result.style.fontWeight = 'bold';
    result.style.fontSize = '100';
    game.style.backgroundColor = '#ff6666';
  }
});
*/

$('#myslider').on('input change',function(){
  strokeWidth = parseInt($(this).val());
});

scroll_bottom = function() {
  if ($('#messages').length > 0) {
    $('#messages').scrollTop($('#messages')[0].scrollHeight);
  }
}

$('form').submit(function(){
  var temp = [myNick , $("#boxMessage").val()];
  socket.emit("send chat message", temp);
  $("#boxMessage").val("");
  return false;
});

$("#resetCanvas").click(function(){
  socket.emit('clearit');
});

$("#readyButton").click(function() {
  socket.emit('ready');
});

$("#submitGuess").click(function() {
  socket.emit('guess', $("#guessField").val());
});
