var express = require('express');
var config = require('../config');
var escape = require('escape-html');  
var crypto = require('crypto');
var reg = /^[0-9]*$/;
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', { title: 'index', admin: req.session.admin });
});

router.get('/admin', function(req, res, next) {
    res.render('admin', { title: 'admin', admin: req.session.admin, flag: config.secret_password });
});

router.get('/logout', function(req, res, next) {
    req.session = null;
    res.json({'status': 'ok'});
});

router.post('/login', function(req, res, next) {
    if(req.body.password !== undefined) {
        var endata = crypto.createHash('md5').update(req.body.password).digest("hex");
        if (reg.test(endata)) {
            var pwd = parseInt(endata.slice(0,3),10);
            password = new Buffer(pwd);
            if(password.toString('base64') == config.secret_password) {
                req.session.admin = 'yes';
                res.json({'status': 'ok' });
            }else{
                res.json({'status': 'error', 'error': 'password wrong: '+password.toString()});
            }
        }else{
            res.json({'status': 'error', 'error': 'password wrong: '+endata.toString()});
        }
    } else {
        res.json({'status': 'error', 'error': 'password missing' });
    }
});

module.exports = router;
