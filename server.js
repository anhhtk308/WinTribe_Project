var express = require('express');
const { builtinModules } = require('module');
var app = express();
var server = require('http').Server(app);
// var io = require('socket.io').listen(server);
var io = require('socket.io')(server, {});
//var io1 = require('socket.io')(server, {});

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
// io1.on('connection', function(socket) {
//     socket.on("inputed",function(data){
//         player_name=data
//     });
// });
var players = {};
var socketLst = {};
io.on('connection', function(socket) {
    console.log('a user connected: ', socket.id);
    players[socket.id] = {
        playersID: socket.id,
        gold: 10,
        x: Math.floor(Math.random() * 700) + 50,
        y: Math.floor(Math.random() * 500) + 50,
        name: '',

    }

    //chatting
    socketLst[socket.id] = socket;
    socket.on('sendMsgToServer', function(data) {
        for (var i in socketLst) {
            //socketLst[i].emit('addToChat', (socket.id + '').slice(2, 7) + ': ' + data);
            socketLst[i].emit('addToChat', data.name + ': ' + data.text);
        }
    });

    //start main
    socket.on('startMainHall', function(data) {
        players[socket.id].name = data.name;
        // send the players object to the new players
        socket.emit('currentPlayers', players);
        // update all other players of the new player
        socket.broadcast.emit('newPlayer', players[socket.id]);
    });

    ///////////////////////////////////////////////////////////////////////////////

    socket.on('disconnect', function() {
        console.log('user disconnected: ', socket.id);
        delete players[socket.id];
        // emit a message to all players to remove this player
        io.emit('disconnected', socket.id);
    });
    socket.on('forceDisconnect', function() {
        console.log('user disconnected: ', socket.id);

        delete players[socket.id];
        io.emit('disconnected', socket.id);
        socket.disconnect();
    });
    socket.on('destroy', function() {
        // console.log(players[socket.id]);
        socket.broadcast.emit('destroy_ship', players[socket.id]);
    })
    socket.on('movement', function(data) {
        players[socket.id].x = data.x;
        players[socket.id].y = data.y;
        players[socket.id].rotation = data.z;

        socket.broadcast.emit('moved', players[socket.id]);
        //onsole.log("movejlkj");
    });




});

server.listen(2000, function() {
    console.log(`Listening on ${server.address().port}`);
});