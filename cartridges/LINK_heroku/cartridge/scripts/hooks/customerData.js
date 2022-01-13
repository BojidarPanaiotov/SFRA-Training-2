'use strict'

function sendUserData(firstName, lastName, email, phone) {
    var userObject = {
        user: {
            'firstname': firstName,
            'lastname': lastName,
            'email': email,
            'phone': phone
        }
    };

    return createHerokuService('POST','/register-user',userObject);
}

function addCustomerNumber(email, customerNumber) {
    var userObjectId = {
        user: {
            'email': email,
            'customerNumber': customerNumber
        }
    };

    return createHerokuService('POST','/update-customernumber',userObjectId);
}

function updateUserData(customerNumber, firstName, lastName, email, phone) {
    var userObject = {
        user: {
            'customerNumber': customerNumber,
            'firstname': firstName,
            'lastname': lastName,
            'email': email,
            'phone': phone
        }
    }

    return createHerokuService('POST','/update-user',userObject);
}

function getUser(customerNumber) {
    var result = createHerokuService('GET',
    '/user?customerNumber=' + customerNumber,
    customerNumber);

    return JSON.parse(result);
}

function saveUserAddress(customerNumber,
    addressid,
    firstname,
    lastname,
    address1,
    address2,
    city,
    zipcode,
    country,
    state,
    phonenumber) {
    var userObject = {
        address: {
            'customerNumber': customerNumber,
            'addressid': addressid,
            'firstname': firstname,
            'lastname': lastname,
            'address1': address1,
            'address2': address2,
            'city': city,
            'zipcode': zipcode,
            'country': country,
            'state': state,
            'phonenumber': phonenumber
        }
    }

    return createHerokuService('POST','/add-address',userObject);
}

function updateAddress(previousId,
    addressid,
    firstname,
    lastname,
    address1,
    address2,
    city,
    zipcode,
    country,
    state,
    phonenumber) {
    var addressObject = {
        address: {
            'previousId': previousId,
            'addressid': addressid,
            'firstname': firstname,
            'lastname': lastname,
            'address1': address1,
            'address2': address2,
            'city': city,
            'zipcode': zipcode,
            'country': country,
            'state': state,
            'phonenumber': phonenumber
        }
    }

    return createHerokuService('POST','/update-address',addressObject);
}

function saveUserCard(cardNumber,
    cardType,
    paymentMethod,
    cardOwner,
    expirationMonth,
    expirationYear,
    securityCode,
    customerNumber) {
    var cardObject = {
        card: {
            'cardNumber': cardNumber,
            'cardType': cardType,
            'paymentMethod': paymentMethod,
            'cardOwner': cardOwner,
            'expirationMonth': expirationMonth,
            'expirationYear': expirationYear,
            'securityCode': securityCode,
            'customerNumber': customerNumber
        }
    }

    return createHerokuService('POST','/save-card',cardObject);
}

function saveOrderData(customerNumber,
    fullName,
    phoneNumber,
    email,
    shippingAddress1,
    shippingAddress2,
    shippingAddressCity,
    shippingAddressPostalCode,
    shippingAddressCountryCode,
    billingAddress1,
    billingAddress2,
    billingAddressCity,
    billingAddressPostalCode,
    billingAddressCountryCode,
    creditCardHolder) {
    var orderObject = {
        order: {
            'customerNumber': customerNumber,
            'fullName': fullName,
            'phoneNumber': phoneNumber,
            'email': email,
            'shippingAddress1': shippingAddress1,
            'shippingAddress2': shippingAddress2,
            'shippingAddressCity': shippingAddressCity,
            'shippingAddressPostalCode': shippingAddressPostalCode,
            'shippingAddressCountryCode': shippingAddressCountryCode,
            'billingAddress1': billingAddress1,
            'billingAddress2': billingAddress2,
            'billingAddressCity': billingAddressCity,
            'billingAddressPostalCode': billingAddressPostalCode,
            'billingAddressCountryCode': billingAddressCountryCode,
            'creditCardHolder': creditCardHolder
        }
    }

    return createHerokuService('POST','/save-order',orderObject);
}

function saveEmailSubscription(email) {
    var emailObject = {
        subscription: {
            'email': email
        }
    };

    return createHerokuService('POST','/save-subscription',emailObject);
}

function createHerokuService(method,urlEndpoint,objectModel) {
    var service = dw.svc.LocalServiceRegistry.createService("heroku.customer.service", {
        createRequest: function (svc, args) {
            svc.setRequestMethod(method);
            svc.URL += urlEndpoint;
            svc.addHeader("Content-Type", "application/json");
            return JSON.stringify(args);
        },
        parseResponse: function (svc, client) {
            return client.text;
        },
        filterLogMessage: function (msg) {
            return msg;
        }
    });

    return service.call(objectModel).object;
}

module.exports = {
    sendUserData: sendUserData,
    addCustomerNumber: addCustomerNumber,
    updateUserData: updateUserData,
    getUser: getUser,
    saveUserAddress: saveUserAddress,
    updateAddress: updateAddress,
    saveUserCard: saveUserCard,
    saveOrderData: saveOrderData,
    saveEmailSubscription: saveEmailSubscription
}
