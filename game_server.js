var socketio = require('socket.io')

module.exports = function(server) {
    var io = socketio.listen(server)
    var sockets = {}

    io.on('connection', function (socket) {
        sockets[socket.id] = socket
        
        socket.on('join', function(message) {
            socket.user_state = 'ready'
        })
        socket.on('user_bet', function(message) {

        })
        socket.on('disconnect', function() {
            console.log("Client has disconnected: " + socket.id);
            delete sockets[socket.id]
        });
    })

    // server process loop
    setTimeout(function () {

    }, 500)
}