(function() {
    var socket = io();

    socket.on('isLogged', function(username) {
        if (!username) {
            var person = prompt("Please enter your name");
            if (person) {
                socket.emit('join', person);
            }
        }
    })

    $('form').submit(function() {
        socket.emit('message', $('#m').val());
        $('#m').val('');
        return false;
    });

    socket.on('message', function(user, msg) {
        $('#messages').append($('<li>').text(user + ': ' + msg));
    });

    socket.on('users', function(user) {
        $('#user-list').append($('<li>').text(user));
    })
})();
