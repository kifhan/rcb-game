var socketio = require('socket.io')
var mongoose = require('mongoose')
var User = require('./models/user')
// var Contract = require()

module.exports = function(server) {
    var io = socketio.listen(server)
    var sockets = []

    io.on('connection', function (socket) {
        sockets.push(socket)
        
        socket.on('join', function(message) {
            socket.user_state = 'ready'
        })
        socket.on('user bet', function(message) {
            socket.currentChoice = message.choice
        })
        socket.on('disconnect', function() {
            console.log("Client has disconnected: " + socket.id);
            sockets.splice(sockets.findIndex(function (element) {
                return element == socket
            }),1)
        });
    })

    // server process loop
    setInterval(function () {
        var coin_result = (Math.floor(Math.random() * 2) == 0) ? 'head' : 'tail';
        // io.emit('turn update',{result: coin_result})
        sockets.forEach(function(socket) {
            var game_result = (socket.currentChoice == coin_result) ? true : false
            socket.emit('turn update', {coin_result: coin_result, game_result: game_result})
        }, this);
    }, 3000)
}