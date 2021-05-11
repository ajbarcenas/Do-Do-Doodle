const express = require("express")
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var path = require("path");
var PORT = process.env.PORT || 3000;

var clients = {};
var line_history = [];
var MAX_GUESSES = 3;

var words = [
  "America",
  "Balloon",
  "Biscuit",
  "Blanket",
  "Chicken",
  "Chimney",
  "Country",
  "Cupcake",
  "Curtain",
  "Diamond",
  "Eyebrow",
  "Fireman",
  "Florida",
  "Germany",
  "Harpoon",
  "Husband",
  "Morning",
  "Octopus",
  "Popcorn",
  "Printer",
  "Sandbox",
  "Skyline",
  "Spinach",
  "Turtle",
  "Pizza",
  "Apple",
  "California",
  "Violin",
  "Map",
  "Flower",
  "Phone",
  "Cone",
  "Fish"
];

var game = {
  word: null,
  artist: null,
  time: 60,   //seconds
  timer: null,
  live: false,
  reset: function() {
    this.live = false;

    line_history = [];

    let client_IDs = Object.keys(clients);
    if (client_IDs.length > 0) {
      //grab random person
      this.artist = client_IDs[Math.floor(Math.random() * client_IDs.length)];
      //grab random word
      this.word = words[Math.floor(Math.random() * words.length)];

      Object.keys(clients).forEach(key => {
        clients[key].ready = false;
        clients[key].correct = false;
        clients[key].guesses = 0;
        // clients[key].score = 0;
      });

      io.emit('lines', line_history);
      io.emit('users list', getUsersList());
    } else {
      this.word = null;
      this.artist = null;
      this.timer = null;
    }
  },
  stop: function() {
    if (this.timer != null && this.live) {
      clearInterval(this.timer);
      io.emit('time', {timeLeft: 0, done: true});
    }
    this.reset();
  },
  start: function() {
    this.live = true;
    //give the artist their word
    clients[this.artist].socket.emit("word", this.word);

    let timeLeft = this.time;
    let that = this;
    this.timer = setInterval(function() {
      if (--timeLeft < 0) {
        that.stop();
      } else {
        io.emit('time', {timeLeft: timeLeft, done: false});
      }
    }, 1000);

    //set everyone to not ready
    Object.keys(clients).forEach(key => {
      clients[key].ready = false;
    });

    io.emit('users list', getUsersList());
  },
}

function getUsersList(){
  let usersList = [];
  let i = 0;

  Object.keys(clients).forEach(key => {
    usersList[i++] = {
      name: clients[key].name,
      isArtist: key == game.artist,
      isReady: clients[key].ready,
      isCorrect: clients[key].correct,
      isDisabled: clients[key].guesses >= MAX_GUESSES && !clients[key].correct,
      score: clients[key].score
    };
  });

  return usersList;
}

//EXPRESS.JS
app.use(express.static(`${__dirname}/client`));

app.get('/', function(req,res) {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(PORT, function() {
  console.log(`Server started on http://localhost:${PORT}`);
});

//SOCKET.IO
io.on('connection', function(socket) {
  clients[socket.id] = {
    socket: socket,
    name: `guest${Object.keys(clients).length+1}`,
    ready: false,
    correct: false,
    guesses: 0,
    score: 0
  };

  if (game.artist == null) {  //server was empty
    game.reset();
  }

  socket.on('disconnect', function() {
    if (clients[socket.id] != null && clients[socket.id].name != null) {
      io.emit('info', `${clients[socket.id].name} disconnected.`);

      delete clients[socket.id];

      if (socket.id == game.artist) {
        game.stop();
      }

      io.emit('users list', getUsersList());
    }
  });

  socket.on('send chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('set nick', function(nick){
    clients[socket.id].name = nick;
    io.emit('info', "New user: " + nick);
    io.emit('users list', getUsersList());
  });

  socket.on('draw_line', function (data) {
    if (game.live && socket.id == game.artist) {
      // add received line to history
      line_history.push(data);
      //broadcast received line
      io.emit('draw_line', data);
    }
  });

  socket.on('clearit', function() {
    if (game.live && socket.id == game.artist) {
      line_history = [];

      io.emit('lines', line_history);
    }
  });

  socket.on('ready', function() {
    if (!game.live) {
      clients[socket.id].ready = true;

      let client_IDs = Object.keys(clients), count = 0;
      client_IDs.forEach(key => {
        if (clients[key].ready) {
          count++;
        }
      });
      if (client_IDs.length > 1 && count == client_IDs.length) {
        game.start();
      }

      io.emit('users list', getUsersList());
    }
  });

  socket.on('guess', function(guess) {
    if (game.live && socket.id != game.artist) {
      if (!clients[socket.id].correct && clients[socket.id].guesses < MAX_GUESSES && game.word.toLowerCase() == guess.toLowerCase()) {
          console.log("here")
          clients[socket.id].correct = true;
          clients[socket.id].score++;
      } else {
        clients[socket.id].guesses++;
      }

      io.emit('users list', getUsersList());

      //reset the game if everyone is correct
      let client_IDs = Object.keys(clients), count = 0;
      client_IDs.forEach(key => {
        if (clients[key].correct || clients[key].guesses >= MAX_GUESSES) {
          count++;
        }
      });
      if (client_IDs.length > 1 && count == client_IDs.length-1) {
        game.stop();
      }
    }
  });

  socket.emit('lines', line_history);
  io.emit('users list', getUsersList());
});
