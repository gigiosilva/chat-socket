const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors');
const moment = require('moment');

let clients = {};
let lastMsgClient;

app.use(cors());

app.use(express.static(__dirname + '/dist'));

app.get('/*', function(req, res) {
    // console.log(req.url)
    res.sendFile(__dirname + '/dist/index.html');
});

// io.sockets.on('connection', function(socket) {
//     // console.log(socket)
//     // once a client has connected, we expect to get a ping from them saying what room they want to join
//     socket.on('room', function(room) {
//         socket.join(room);
//     });

//     socket.on('join', function(name, room) {
//         socket.join(room);
//         io.sockets.in('room').emit('update', 'what is going on, party people?');
//     });

// });

io.on("connection", function (client) {

    client.on("join", function(name, room){
        client.room = room;
        client.username = name;
        client.join(room);
        clients[client.id] = {name: name, room: room};
        client.emit("update", JSON.stringify({msg: `You are connected to the server as ${name}`, server: true}));
        client.broadcast.to(client.room).emit("update", JSON.stringify({msg: `${name} has joined the server`, server: true}));
        io.of('/').in(client.room).clients((err, onlines) => {
            io.sockets.in(client.room).emit('users', JSON.stringify({users: onlines.map(o => clients[o].name)}));
        });
    });

    client.on("send", function(msg){
        let continuation = lastMsgClient == client.id ? true : false;
        lastMsgClient = client.id;
        console.log(client.room, client.id)
        client.broadcast.to(client.room).emit("chat", JSON.stringify({name: clients[client.id].name, msg: msg, external: true, continuation: continuation}));
    });

    client.on("messages-checked", function(msg) {
      client.broadcast.to(client.room).emit("messages-seen", JSON.stringify({msg: msg}));
    });

    client.on("disconnect", function(){
        if(clients[client.id] !== undefined) {
            io.to(client.room).emit("update", JSON.stringify({msg: `${clients[client.id].name} has left the server`, server: true}));
        }
        delete clients[client.id];
        io.of('/').in(client.room).clients((err, onlines) => {
            io.sockets.in(client.room).emit('users', JSON.stringify({users: onlines.map(o => clients[o].name)}));
        });
    });
});

const port = process.env.PORT || 3000;

http.listen(port, function(){
  console.log(`Running on port ${port}`);
});
