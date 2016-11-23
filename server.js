var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = [];
var messages = [];
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendfile('index.html');
});

io.on('connection', function(socket) {

    socket.on('message', function(msg) {
        socket.emit('message', msg.user, msg.message);
        socket.broadcast.emit('message', msg.user, msg.message);
        checkLengthMessages(msg);
    });

    socket.on('join', function(user) {
        socket.username = user;
        if (users.indexOf(user) == -1) {
            users.push(user);
            socket.broadcast.emit('users', user);
            users.forEach(function(user) {
                socket.emit('users', user);
            });
        } else {
            users.forEach(function(user) {
                socket.emit('users', user);
            });
        }
        messages.forEach(function(msg) {
            socket.emit('message', msg.user, msg.message);
        });
    });

    socket.on('disconnect', function() {
        users = users.splice(1, users.indexOf(socket.username));
        socket.broadcast.emit('removeUser', socket.username);
        if (!users.length) {
            messages = [];
        }
    });
});

http.listen(port, function() {
    console.log('listening port: ' + port);
});

function checkLengthMessages(msg) {
    if (messages.length > 10) {
        messages.shift();
    }
    messages.push(msg);
}
