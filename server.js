const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

var clients = {};

app.use(express.static(__dirname + '/dist'));

app.get('/*', function(req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});

io.on("connection", function (client) {
    
    console.log(client.id);

    client.on("join", function(name){
        console.log("Joined: " + name);
        clients[client.id] = name;
        client.emit("update", JSON.stringify({msg: `You are connected to the server as ${name}`, server: true}));
        client.broadcast.emit("update", JSON.stringify({msg: `${name} has joined the server`, server: true}));
    });
    
    client.on("send", function(msg){

        client.broadcast.emit("chat", JSON.stringify({name: clients[client.id], msg: msg, external: true}));
    });
    
    client.on("disconnect", function(){
        console.log("Disconnected: " + clients[client.id]);
        io.emit("update", JSON.stringify({msg: `${clients[client.id]} has left the server`, server: true}));
    });
});

const port = process.env.PORT || 3000;

http.listen(port, function(){
  console.log(`Running on port ${port}`);
});