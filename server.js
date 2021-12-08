var express = require('express');
const { builtinModules } = require('module');
var app = express();
var server = require('http').Server(app);
// var io = require('socket.io').listen(server);
var io = require('socket.io')(server, {});
//var io1 = require('socket.io')(server, {});
const port = process.env.PORT || 2000;

var players = {};
var bullet = {

};
var socketLst = {};

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
var num_player = 0;
//socket connect
io.on('connection', function(socket) {
    console.log('a user connected: ', socket.id);

    //create player
    players[socket.id] = {
            playersID: socket.id,
            gold: 1000,
            x: 931,
            y: 735,
            // x: Math.floor(Math.random() * 700) + 50,
            // y: Math.floor(Math.random() * 500) + 50,
            name: '',
            status: 'turn',
            skills: {
                speed: false,
                hp: false,
                iceBom: false,
                speedBullet: false,
                strong: false,
                shipRotationSpeed: false,
            }
        }
        // players[socket.id] = {
        //         playersID: socket.id,
        //         x: Math.floor(Math.random() * 4700) + 50,
        //         y: Math.floor(Math.random() * 4700) + 50,
        //         rotation: 0,
        //         health: 100,
        //         name: "aaa",
        //         type: "",
        //         score: 0,

    //     }
    //create bullet
    bullet[socket.id] = {
        bulletID: socket.id,
        x: 0,
        y: 0,
        rotation: 0
    };
    //chatting
    socketLst[socket.id] = socket;
    socket.on('sendMsgToServer', function(data) {
        for (var i in socketLst) {
            //socketLst[i].emit('addToChat', (socket.id + '').slice(2, 7) + ': ' + data);
            socketLst[i].emit('addToChat', data.name + ': ' + data.text);
        }
    });
    // if we start gamemain it will do all funcion in gamemain
    socket.on("startGameMain", function(data) {
        num_player++;
        //players[socket.id].name=data.name;
        players[socket.id].type = data.type;

        socket.emit("current_on", { num: num_player });
        socket.broadcast.emit("add_player", { num: num_player })
        socket.emit('currentPlayersGameMain', players);
        socket.broadcast.emit('newPlayerGameMain', players[socket.id]);
        socket.on('forceDisconnect', function() {
            console.log('user disconnected: ', socket.id);

            delete players[socket.id];
            io.emit('disconnected', socket.id);
            // num_player--;
            // socket.broadcast.emit("add_player",{num:num_player})
            socket.disconnect();
        });
        socket.on('destroy', function(data) {
            socket.broadcast.emit('destroy_ship', players[socket.id]);
            socket.broadcast.emit('up_score', data)
        })
        socket.on('movement', function(data) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            players[socket.id].rotation = data.z;
            socket.broadcast.emit('moved', players[socket.id]);

        });

        socket.on('fire', function(data) {
            bullet[socket.id].x = data.x;
            bullet[socket.id].y = data.y;
            bullet[socket.id].rotation = data.z;
            io.emit('fired', bullet[socket.id]);
        });
        socket.on('movement_bullet', function(data) {
            bullet[socket.id].x = data.x;
            bullet[socket.id].y = data.y;
            bullet[socket.id].rotation = data.z
            socket.broadcast.emit('bullet_moved', bullet[socket.id]);
        });
        socket.on("dame", function() {
            players[socket.id].health -= 10;
            socket.broadcast.emit('damed', players[socket.id]);
        });
        socket.on("scored", function(data) {
            players[socket.id].score = data.score;
            socket.emit("print_score", players[socket.id]);
        })
    });
    //disconnect
    socket.on('disconnect', function() {
        console.log('user disconnected: ', socket.id);
        delete players[socket.id];
        num_player--;
        socket.broadcast.emit("add_player", { num: num_player })
        io.emit('disconnected', socket.id);
    });
    //start sảnh
    socket.on('startMainHall', function(data) {
        players[socket.id].name = data.name;
        // send the players object to the new players
        socket.emit('currentPlayersMain', players);
        // update all other players of the new player
        socket.broadcast.emit('newPlayerMain', players[socket.id]);

        socket.on('movement_player', function(data) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            players[socket.id].status = data.status;
            socket.broadcast.emit("player_moved", players[socket.id]);
        });

        socket.on('destroy', function() {
            socket.broadcast.emit('destroy_player_main', players[socket.id]);
        });
        socket.emit('getPlayerMain', players[socket.id]);
    });
    //start matching game
    socket.on('startMatchingGame', function(data) {
        socket.emit('getPlayer', players[data]);
        socket.on('updateGold', function(data) {
            players[socket.id].gold = data.gold;
        });
    });

    //start shop
    socket.on('startShop', function(data) {
        socket.emit('getPlayerShop', players[data]);
        socket.on('updateShop', function(data) {
            players[socket.id].gold = data.gold;
            players[socket.id].skills = data.skills;
        });
    });

});

server.listen(port, function() {
    console.log(`Listening on ${server.address().port}`);
});