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

    socket.on('disconnect', function() {
        console.log('user disconnected: ', socket.id);
        delete players[socket.id];
        // emit a message to all players to remove this player
        //socket.emit('disconnect', socket.id);
    });
    socketLst[socket.id] = socket;
    socket.on('sendMsgToServer', function(data) {
        for (var i in socketLst) {
            //socketLst[i].emit('addToChat', (socket.id + '').slice(2, 7) + ': ' + data);
            socketLst[i].emit('addToChat', data.name + ': ' + data.text);
        }
    });
    //socket.emit('startGame2', questions);

});

server.listen(2000, function() {
    console.log(`Listening on ${server.address().port}`);
});