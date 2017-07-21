var express = require('express');
var router = express.Router();
var Account = require('../models/account')
var passport = require('passport')

var isUserPermited = passport.authenticate('login',{session: false})

router.get('/', isUserPermited, function(req,res,next){
    Account.find(function(err, accounts){
        if(err) return res.status(500).send({error: 'database failure'});
        res.json(accounts);
    })
})
// router.get('/', function(req,res,next){
//     res.json({text: 'good'});
// })
router.get('/:account_url', isUserPermited, function(req,res,next){
    Account.findOne({account_url: req.params.account_url}, function(err, account){
        if(err) return res.status(500).json({error: err});
        if(!account) return res.status(404).json({error: 'account not found'});
        res.json(account);
    })
})
router.post('/', isUserPermited, function(req,res,next){
    var account = new Account();
    account.eachPath(function (key, path) {
        if(req.body[key]) account[key] = req.body[key]
    })

    account.save(function(err){
        if(err){
            console.error(err);
            res.json({result: 0});
            return;
        }
        res.json({result: 1});
    })
})
router.put('/:account_url', isUserPermited, function(req,res,next){
    Account.findOne({account_url: req.params.account_url}, function(err, account){
        if(err) return res.status(500).json({ error: 'database failure' });
        if(!account) return res.status(404).json({ error: 'account not found' });

        account.eachPath(function (key, path) {
            if(req.body[key]) account[key] = req.body[key]
        })

        account.save(function(err){
            if(err) res.status(500).json({error: 'failed to update'});
            res.json({message: 'account updated'});
        });
    });
})
router.delete('/:account_url', isUserPermited, function(req,res,next){
    Account.remove({ _id: req.params.account_url }, function(err, output){
        if(err) return res.status(500).json({ error: "database failure" });
        res.status(204).end();
    })
})
router.delete('/', isUserPermited, function(req,res,next){
    Account.remove(function(err, output){
        if(err) return res.status(500).json({ error: "database failure" });
        res.status(204).end();
    })
})

module.exports = router;
