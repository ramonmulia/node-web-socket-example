var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = [];
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendfile('index.html');
});

io.on('connection', function(socket) {

    socket.emit('isLogged', socket.username);

    socket.on('message', function(msg) {
        socket.emit('message', socket.username, msg);
        socket.broadcast.emit('message', socket.username, msg);
    });

    socket.on('join', function(user) {
        socket.username = user;
        socket.broadcast.emit('users', user);
        users.push(user);
        users.forEach(function(user) {
            socket.emit('users', user);
        });
    });
});

io.on('disconect', function(socket) {
    var index = array.indexOf(socket.username);
    users = users.splice(1, index);
    socket.emit('users', user);
});

http.listen(port, function() {
    console.log('listening port: ' + port);
});
