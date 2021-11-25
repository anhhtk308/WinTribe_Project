var express = require('express');
var app = express();
var server = require('http').Server(app);
// var io = require('socket.io').listen(server);
var io = require('socket.io')(server, {});
var questions = [{
        id: 1,
        question: "1abc",
        answers: "1abc"
    },
    {
        id: 2,
        question: "2abc",
        answers: "2abc"
    }, {
        id: 3,
        question: "3abc",
        answers: "3abc"
    }, {
        id: 4,
        question: "4abc",
        answers: "4abc"
    }, {
        id: 5,
        question: "5abc",
        answers: "5abc"
    }
]
var players = {};
var star = {
    x: Math.floor(Math.random() * 700) + 50,
    y: Math.floor(Math.random() * 500) + 50
};
var scores = {
    blue: 0,
    red: 0
};

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log('a user connected: ', socket.id);

    socket.on('disconnect', function() {
        console.log('user disconnected: ', socket.id);
        delete players[socket.id];
        // emit a message to all players to remove this player
        //socket.emit('disconnect', socket.id);
    });

    socket.emit('startGame2', questions);

});

server.listen(2000, function() {
    console.log(`Listening on ${server.address().port}`);
});