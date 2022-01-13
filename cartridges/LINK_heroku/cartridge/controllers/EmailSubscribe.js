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
        isValidEmailid = validateEmail(email);

        if (isValidEmailid) {
            //Heroku Service
            if(HookMgr.hasHook('custom.customer.data')){
                HookMgr.callHook('custom.customer.data',
                'saveEmailSubscription',
                email);
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

function validateEmail(email) {
    var regex = /^[\w.%+-]+@[\w.-]+\.[\w]{2,6}$/;
    return regex.test(email);
}

module.exports = server.exports();