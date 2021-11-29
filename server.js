var express = require('express');
const { builtinModules } = require('module');
var app = express();
var server = require('http').Server(app);
// var io = require('socket.io').listen(server);
var io = require('socket.io')(server, {});
//var io1 = require('socket.io')(server, {});

var players = {};
var bullet = {
    
};
var scores = {
    blue: 0,
    red: 0
};
var player_name='';
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
// io1.on('connection', function(socket) {
//     socket.on("inputed",function(data){
//         player_name=data
//     });
// });
io.on('connection', function(socket) {
    console.log('a user connected: ', socket.id);
    players[socket.id]={
        playersID:socket.id,
        x: Math.floor(Math.random() * 700) + 50,
        y: Math.floor(Math.random() * 500) + 50,
        rotation:0,
        health:100
        
    }
    
    bullet[socket.id]={
        bulletID:socket.id,
        x:0,
        y:0,
        rotation:0
    }
    socket.emit('currentPlayers',players);
    socket.broadcast.emit('newPlayer',players[socket.id]);
    socket.on('disconnect', function() {
        console.log('user disconnected: ', socket.id);
        delete players[socket.id];
        // emit a message to all players to remove this player
        io.emit('disconnected', socket.id);
    });
    socket.on('forceDisconnect', function(){
        console.log('user disconnected: ', socket.id);
        
        delete players[socket.id];
        io.emit('disconnected', socket.id);
        socket.disconnect();
    });
    socket.on('destroy',function(){
       // console.log(players[socket.id]);
        socket.broadcast.emit('destroy_ship',players[socket.id]);
    })
    socket.on('movement',function(data){
        players[socket.id].x=data.x;
        players[socket.id].y=data.y;
        players[socket.id].rotation=data.z;
        
        socket.broadcast.emit('moved',players[socket.id]);
        //onsole.log("movejlkj");
    });
    //socket.emit('fired',bullet);
    socket.on('fire',function(data){
        bullet[socket.id].x=data.x;
        bullet[socket.id].y=data.y;
        bullet[socket.id].rotation=data.z;
        //console.log(bullet);
        io.emit('fired',bullet[socket.id]);
    });
    socket.on('movement_bullet',function(data){
        bullet[socket.id].x=data.x;
        bullet[socket.id].y=data.y;
        bullet[socket.id].rotation=data.z
        socket.broadcast.emit('bullet_moved',bullet[socket.id]);
    });
    socket.on("dame",function(){
        players[socket.id].health-=10;
        socket.broadcast.emit('damed',players[socket.id]);
    })

});

server.listen(2003, function() {
    console.log(`Listening on ${server.address().port}`);
});