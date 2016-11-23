(function() {
    var socket = io();
    var person = prompt("Please enter your name");
    socket.emit('join', person);

    $('form').submit(function() {
        socket.emit('message', {
            user: person,
            message: $('#m').val()
        });
        $('#m').val('');
        return false;
    });

    socket.on('message', function(user, msg) {
        $('#messages').append($('<li>').text(user + ': ' + msg));
    });

    socket.on('users', function(user) {
        $('#user-list').append($('<li id="' + user + '">').text(user));
    });

    socket.on('removeUser', function(user) {
        debugger;
        $('#user-list').find($('#' + user)).remove();
    })
})();
