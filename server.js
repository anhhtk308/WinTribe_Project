var express = require('express');
var app = express();
var server = require('http').Server(app);
// var io = require('socket.io').listen(server);
var io = require('socket.io')(server, {});

var players = {};

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
var socketLst = {};
io.on('connection', function(socket) {
    console.log('a user connected: ', socket.id);

    players[socket.id] = {
        playersID: socket.id,
        gold: 10,
        x: Math.floor(Math.random() * 700) + 50,
        y: Math.floor(Math.random() * 500) + 50,
        name: '',
        status: 'turn'
    }
    socket.on('startMainHall', function(data) {
        players[socket.id].name = data.name;
        // send the players object to the new players
        socket.emit('currentPlayersMain', players);
        // update all other players of the new player
        socket.broadcast.emit('newPlayerMain', players[socket.id]);

        // socket.on('movement_player', function(data) {
        //     players[socket.id].x = data.x;
        //     players[socket.id].y = data.y;
        //     players[socket.id].status = data.status;
        //     socket.broadcast.emit("player_moved", players[socket.id]);
        // });

        // socket.on("not_change", function(data) {
        //     players[socket.id].status = data.status;
        //     socket.broadcast.emit("player_not_change", players[socket.id]);
        // });
    });

    socket.on('movement_player', function(data) {
        players[socket.id].x = data.x;
        players[socket.id].y = data.y;
        players[socket.id].status = data.status;
        socket.broadcast.emit("player_moved", players[socket.id]);
    });

    socket.on("not_change", function(data) {
        players[socket.id].status = data.status;
        socket.broadcast.emit("player_not_change", players[socket.id]);
    });

    socket.on('startTest', function(data) {
        socket.emit('getPlayer', players[data]);
    });

    socket.on('disconnect', function() {
        console.log('user disconnected: ', socket.id);
        delete players[socket.id];
        delete socketLst[socket.id];
        // emit a message to all players to remove this player
        socket.emit('disconnected', socket.id);
    });
    //chatting
    socketLst[socket.id] = socket;
    socket.on('sendMsgToServer', function(data) {
        for (var i in socketLst) {
            //socketLst[i].emit('addToChat', (socket.id + '').slice(2, 7) + ': ' + data);
            socketLst[i].emit('addToChat', data.name + ': ' + data.text);
            console.log(data.name + ": " + (socketLst[i]).id + "\n");
        }
    });
});

server.listen(2000, function() {
    console.log(`Listening on ${server.address().port}`);
});