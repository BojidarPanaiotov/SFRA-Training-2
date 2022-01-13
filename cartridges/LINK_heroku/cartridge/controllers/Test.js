'use strict'

var server = require('server');

server.get('Show', function (req, res, next) {
    var HookMgr = require('dw/system/HookMgr');
    var res2 = HookMgr.callHook('custom.customer.data','getUser','BP00015075');
    
    res.render('test/test')

    next();
});

module.exports = server.exports();