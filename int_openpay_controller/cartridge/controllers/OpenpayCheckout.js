'use strict';

/**
 * Controller for Openpay payment
 *
 */

/* API Includes */
var OrderMgr = require('dw/order/OrderMgr');
var URLUtils = require('dw/web/URLUtils');
var Pipeline = require('dw/system/Pipeline');
var PaymentMgr = require('dw/order/PaymentMgr');
var Transaction = require('dw/system/Transaction');

/* Script Modules */
var app = require('app_storefront_controllers/cartridge/scripts/app');
var guard = require('app_storefront_controllers/cartridge/scripts/guard');
var i_planid = require('int_openpay_core/cartridge/scripts/checkout/getPlanID');
var i_prepare = require('int_openpay_core/cartridge/scripts/checkout/prepareRedirect');
var i_status = require('int_openpay_core/cartridge/scripts/checkout/sendStatus');

var Order = app.getModel('Order');
var PaymentProcessor = app.getModel('PaymentProcessor');

function doOpenpayCheckout(order) {
	
	var plan = i_planid.getPlanID(order);
	var returnurl = dw.web.URLUtils.https('OpenpayCheckout-ContinueOpenpay','order_id',order.orderNo,'order_token',order.getOrderToken());
	var handoverurl = i_prepare.prepare(order,plan.PlanID,returnurl);
	
	if (!handoverurl.error && handoverurl.HandoverURL) {
		response.redirect(handoverurl.HandoverURL);
		return {redirected: true};
	} else {
		return {redirected: false};
	}
	
}


/**
 * Continue Openpay Checkout after redirect from Openpay server
 */
function continueOpenpay() {
	var order = OrderMgr.getOrder(request.httpParameterMap.orderid.stringValue);
	var paymentInstrument, openpaypaymentInstrument;
	var iter = order.getPaymentInstruments().iterator();
	while (iter.hasNext()) {
		openpaypaymentInstrument = iter.next();
		if((openpaypaymentInstrument.paymentMethod).toLowerCase() == 'openpay'){
			paymentInstrument = openpaypaymentInstrument;
		}
	 }
    var paymentProcessor = PaymentMgr.getPaymentMethod(paymentInstrument.getPaymentMethod()).getPaymentProcessor();

    Transaction.begin();

    paymentInstrument.paymentTransaction.transactionID = request.httpParameterMap.orderid.stringValue;
    paymentInstrument.paymentTransaction.paymentProcessor = paymentProcessor;
    Transaction.commit();
    var orderPlacementStatus;
    if (order && request.httpParameterMap.order_token.stringValue === order.getOrderToken().toString()) {
    	if (request.httpParameterMap.status.stringValue === "SUCCESS") {
	        orderPlacementStatus = Order.submit(order);
	        var statusresponse = i_status.sendStatus(order);
	        if (statusresponse.Success) {
        		Transaction.begin();
        		order.custom.openpayOrderStatus = statusresponse.orderStatus;
        		order.custom.openpayPlanStatus = statusresponse.planStatus;
    			Transaction.commit();
	    	}
	        if (!orderPlacementStatus.error) {
	        	session.forms.singleshipping.clearFormElement();
	            session.forms.multishipping.clearFormElement();
	            session.forms.billing.clearFormElement();
	            return require('app_storefront_controllers/cartridge/controllers/COSummary').ShowConfirmation(order);
	        }
    	} else if (request.httpParameterMap.status.stringValue === "FAILURE" || request.httpParameterMap.status.stringValue === "CANCELLED") {
    		Transaction.begin();
    			var stat = OrderMgr.failOrder(order);
    		Transaction.commit();
    	}
    }
    require('app_storefront_controllers/cartridge/controllers/Home').Show();
}

/**
 * Return URL for cancel and fail
 */
function failOpenpay() {
	
	var order = Order.get(request.httpParameterMap.orderid.stringValue);
	if (request.httpParameterMap.status.stringValue === "FAILURE" || request.httpParameterMap.status.stringValue === "CANCELLED") {
		Transaction.begin();
			var stat = OrderMgr.failOrder(order.object);
		Transaction.commit();
	}
    require('app_storefront_controllers/cartridge/controllers/Home').Show();
}

/*
 * Exposed web methods
 */

exports.DoOpenpayCheckout = guard.ensure(['post'], doOpenpayCheckout);

exports.ContinueOpenpay = guard.ensure(['https'], continueOpenpay);

exports.FailOpenpay = guard.ensure(['https'], failOpenpay);

