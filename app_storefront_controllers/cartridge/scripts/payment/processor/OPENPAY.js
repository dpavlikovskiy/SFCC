'use strict';

/* API Includes */
var Pipeline = require('dw/system/Pipeline');
var OrderMgr = require('dw/order/OrderMgr');
var Cart = require('~/cartridge/scripts/models/CartModel');
var PaymentMgr = require('dw/order/PaymentMgr');
var Transaction = require('dw/system/Transaction');
/* Script Modules */
var app = require('~/cartridge/scripts/app');

/**
 * Handles Openpay order process. Sends purchase price and  receives a planID
 * returns 'success'.
 */
function Handle(args) {
    var cart = Cart.get(args.Basket);

    Transaction.wrap(function () {
        cart.removeExistingPaymentInstruments('Openpay');
        cart.createPaymentInstrument('Openpay', cart.getNonGiftCertificateAmount());
    });

    return {success: true};
}



/**
 * Authorizes Openpay
 */
function Authorize(args) {
	var order = OrderMgr.getOrder(args.OrderNo);
	var co = require('int_openpay_controller/cartridge/controllers/OpenpayCheckout').DoOpenpayCheckout(order);
	if (co.redirected) {
		return {redirected: true};
	} else {
		return {error: true};
	}
}


/*
 * Module exports
 */

/*
 * Local methods
 */
exports.Handle = Handle;
exports.Authorize = Authorize;
