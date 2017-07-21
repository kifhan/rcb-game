var express = require('express');
var router = express.Router();

var isLogedin = function (req, res, next) {
  if (req.isAuthenticated()) return next()
  res.redirect('/login')
}

/* GET users listing. */
router.get('/', isLogedin, function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
