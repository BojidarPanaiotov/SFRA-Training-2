'use strict'

var server = require('server');

var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var URLUtils = require('dw/web/URLUtils');
var Resource = require('dw/web/Resource');
var HookMgr = require('dw/system/HookMgr');

server.extend(module.superModule);

server.replace('SaveAddress', csrfProtection.validateAjaxRequest, function (req, res, next) {
    var CustomerMgr = require('dw/customer/CustomerMgr');
    var Transaction = require('dw/system/Transaction');
    var formErrors = require('*/cartridge/scripts/formErrors');
    var accountHelpers = require('*/cartridge/scripts/helpers/accountHelpers');
    var addressHelpers = require('*/cartridge/scripts/helpers/addressHelpers');

    var addressForm = server.forms.getForm('address');
    var addressFormObj = addressForm.toObject();
    addressFormObj.addressForm = addressForm;
    var customerNo = req.currentCustomer.profile.customerNo;
    var customer = CustomerMgr.getCustomerByCustomerNumber(customerNo);
    var addressBook = customer.getProfile().getAddressBook();

    if (addressForm.valid) {
        res.setViewData(addressFormObj);
        this.on('route:BeforeComplete', function () { // eslint-disable-line no-shadow
            var formInfo = res.getViewData();

            var herokuServiceExist = HookMgr.hasHook('custom.customer.data');

            if (req.querystring.addressId && herokuServiceExist) {
                var result = HookMgr.callHook('custom.customer.data',
                    'updateAddress',
                    formInfo.queryString.split('=')[1],
                    formInfo.addressId,
                    formInfo.firstName,
                    formInfo.lastName,
                    formInfo.address1,
                    formInfo.address2,
                    formInfo.city,
                    formInfo.postalCode,
                    formInfo.country,
                    formInfo.states.stateCode,
                    formInfo.phone
                );

                if (!result) {
                    prepareErrorJsonResponse('error.message.error.heroku.update', formInfo, addressForm);

                    return;
                }

            } else if (!addressBook.getAddress(formInfo.addressId) && herokuServiceExist) {
                var result = HookMgr.callHook('custom.customer.data',
                    'saveUserAddress',
                    customerNo,
                    formInfo.addressId,
                    formInfo.firstName,
                    formInfo.lastName,
                    formInfo.address1,
                    formInfo.address2,
                    formInfo.city,
                    formInfo.postalCode,
                    formInfo.country,
                    formInfo.states.stateCode,
                    formInfo.phone
                );

                if (!result) {
                    prepareErrorJsonResponse('error.message.error.heroku.create', formInfo, addressForm);

                    return;
                }
            }
            Transaction.wrap(function () {
                var address = null;

                if (formInfo.addressId.equals(req.querystring.addressId) || !addressBook.getAddress(formInfo.addressId)) {
                    address = req.querystring.addressId ?
                        addressBook.getAddress(req.querystring.addressId) :
                        addressBook.createAddress(formInfo.addressId);
                }

                if (address) {
                    if (req.querystring.addressId) {
                        address.setID(formInfo.addressId);
                    }

                    if (HookMgr.hasHook('custom.customer.data')) {

                    }
                    // Save form's address
                    addressHelpers.updateAddressFields(address, formInfo);

                    // Send account edited email
                    accountHelpers.sendAccountEditedEmail(customer.profile);

                    res.json({
                        success: true,
                        redirectUrl: URLUtils.url('Address-List').toString()
                    });
                } else {
                    prepareErrorJsonResponse('error.message.idalreadyexists', formInfo, addressForm)
                }
            });
        });
    } else {
        res.json({
            success: false,
            fields: formErrors.getFormErrors(addressForm)
        });
    }
    return next();
});

function prepareErrorJsonResponse(messagePath, formInfo, addressForm) {
    formInfo.addressForm.valid = false;
    formInfo.addressForm.addressId.valid = false;
    formInfo.addressForm.addressId.error = Resource.msg(messagePath, 'forms', null);
    res.json({
        success: false,
        fields: formErrors.getFormErrors(addressForm)
    });
}
module.exports = server.exports();
