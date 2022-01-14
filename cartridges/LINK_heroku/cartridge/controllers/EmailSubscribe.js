'use strict'

var server = require('server');

server.extend(module.superModule);

server.replace('Subscribe', function (req, res, next) {
    var Resource = require('dw/web/Resource');
    var hooksHelper = require('*/cartridge/scripts/helpers/hooks');
    var HookMgr = require('dw/system/HookMgr');

    var email = req.form.emailId;
    var isValidEmailid;
    if (email) {
        isValidEmailid = /^[\w.%+-]+@[\w.-]+\.[\w]{2,6}$/.test(email);

        if (isValidEmailid) {
            if(HookMgr.hasHook('custom.customer.data')){
                var result = HookMgr.callHook('custom.customer.data',
                'saveEmailSubscription',
                email);

                if(!result){
                    res.json({
                        error: true,
                        msg: Resource.msg('subscribe.email.invalid', 'homePage', null)
                    });

                    return next();
                }
            }
            hooksHelper('app.mailingList.subscribe', 'subscribe', [email], function () {});
            res.json({
                success: true,
                msg: Resource.msg('subscribe.email.success', 'homePage', null)
            });
        } else {
            res.json({
                error: true,
                msg: Resource.msg('subscribe.email.invalid', 'homePage', null)
            });
        }
    } else {
        res.json({
            error: true,
            msg: Resource.msg('subscribe.email.invalid', 'homePage', null)
        });
    }

    next();
});

module.exports = server.exports();