var app = require('express')(),
  http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

let logDateTime = function(){
  console.log(moment().format('M/D/YY HH:mm:ss a'));
};

app.get('/', function(req,res) {
    res.sendFile(__dirname + "/index.html");
  });

io.on('connection', function(client){

  client.on('join', function(name) {
    client.nickname = name;
  });

  console.log('Client connected: ' + client.nickname);
  logDateTime();

  client.on('disconnect', function(){
    client.broadcast.emit("messages", `Client ${client.nickname} disconnected`);
    console.log('Client disconnected');
  });

  client.on('messages', function(data){
    var nickname = client.nickname;

    client.broadcast.emit("messages", nickname + ": " + data);
    client.emit("messages", nickname + ": " + data);
    console.log(data);
  });
});

http.listen(8080, function() {
  console.log('listening on *:8080');
});
