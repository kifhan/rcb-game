var express = require('express');
var router = express.Router();
var passport = require('passport')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Simple Game' });
});

router.post('/login', passport.authenticate('login', {failureRedirect: '/', failureFlash: true}), 
// 인증 실패 시 401 리턴, {} -> 인증 스트레티지
  function (req, res) { // login 성공할 경우 
    res.redirect('/users');
  });

router.get('/sign.up', function(req, res, next) {
  res.render('signup', { title: 'Simple Game' });
});
router.post('/signup', passport.authenticate('signup', {
  successRedirect : '/users', 
  failureRedirect : '/', //가입 실패시 redirect할 url주소
  failureFlash : true 
}))
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

module.exports.index = router;
// module.exports.users = require('./users')
// module.exports.accounts = require('./accounts')
// module.exports.transactions = require('./transactions')
// module.exports.rest = require('./rest')