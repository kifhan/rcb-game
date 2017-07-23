var SocketIO = require('socket.io-client')

function RcbGame() {
    var self = this
    if (!(self instanceof RcbGame)) return new RcbGame()

    var buttons = document.getElementsByClassName("bet_button");
    for(var i = 0; i < buttons.length; i++){
        buttons.item(i).addEventListener('change', self.onBetButton.bind(self))
    }
    document.getElementById('bet_range').addEventListener('change', self.onBetRange.bind(self))

    self.currentChoice = 'giveup'
    self.betRange = 10
    self.totalMoney = 0
    document.getElementById('game_money').innerHTML = self.totalMoney
    document.getElementById('bet_range_num').innerText = self.betRange
    document.getElementById('loan_button').className += ' hide'
    document.getElementById('loan_button').addEventListener('click', self.onLoanClick.bind(self))

    self.socket = SocketIO(window.location.hostname + ":" + window.location.port);
    self.socket.on('turn update', self.turn_update.bind(self))
    console.log('init')
}
RcbGame.prototype.onBetButton = function (e) {
    var self = this
    self.currentChoice = e.target.value
    // console.log('user clicked: ' + e.target.value)
    self.user_bet()
}
RcbGame.prototype.onBetRange = function (e) {
    var self = this
    self.betRange = e.target.value
    // console.log('user clicked: ' + self.betRange)
    document.getElementById('bet_range_num').innerText = self.betRange
    self.user_bet()
}
RcbGame.prototype.onLoanClick = function (message) {
    var self = this

}

RcbGame.prototype.turn_update = function (message) {
    var self = this
    // console.log('got from server: '+ message.coin_result + '. You ' + (message.game_result ? 'won!' : 'lose!'))

    var prev_coin = document.getElementById('prev-coin')
    prev_coin.className = prev_coin.className.replace(" hide", "")
    prev_coin.className = prev_coin.className.replace(" head", "")
    prev_coin.className = prev_coin.className.replace(" tail", "")
    prev_coin.className += ' ' + message.coin_result
    document.getElementById('game_message').innerText = 'You ' + (message.game_result ? 'won!' : 'lose!')
    setTimeout(function() {
        prev_coin.className = prev_coin.className.replace(" head", "")
        prev_coin.className = prev_coin.className.replace(" tail", "")
        prev_coin.className += ' hide'
        document.getElementById('game_message').innerText = ''
    }, 1000);

    document.getElementById('game_money').innerHTML = self.totalMoney

    self.user_bet()

    if(self.totalMoney < 10) {
        var loanButton = document.getElementById('loan_button')
        loanButton.className = loanButton.className.replace(" hide", "")
    }
}
RcbGame.prototype.user_bet = function () {
    var self = this
    if(!self.socket) return 
    self.socket.emit('user bet', {choice: self.currentChoice, amount: self.totalMoney * (self.betRange*0.01)})
}

module.exports = RcbGame