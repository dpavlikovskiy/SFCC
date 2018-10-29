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

var token = "30000000000000895|cd8ddfd7-1033-4b93-8cd4-a43bce121747"; // dw.system.Site.getCurrent().getCustomPreferenceValue('to1');
var endpointurl = "https://retailer.myopenpay.com.au/ServiceTraining/JAMServiceImpl.svc/"; // dw.system.Site.getCurrent().getCustomPreferenceValue('to2');
var handoverurl = "https://retailer.myopenpay.com.au/WebSalesTraining/";
var timeout = 10000; // dw.system.Site.getCurrent().getCustomPreferenceValue('to3');
var http = require('dw/net/HTTPClient');

/* Script Modules */
var app = require('app_storefront_controllers/cartridge/scripts/app');
var guard = require('app_storefront_controllers/cartridge/scripts/guard');
var i_planid = require('~/cartridge/scripts/checkout/getPlanID');
var i_prepare = require('~/cartridge/scripts/checkout/prepareRedirect');
var i_status = require('~/cartridge/scripts/checkout/sendStatus');

var Order = app.getModel('Order');
var PaymentProcessor = app.getModel('PaymentProcessor');

function doOpenpayCheckout(order) {

	var plan = i_planid.getPlanID(order);
	var returnurl = dw.web.URLUtils.https('OpenpayCheckout-ContinueOpenpay',
			'order_id', order.orderNo, 'order_token', order.getOrderToken());
	var handoverurl = i_prepare.prepare(order, plan.PlanID, returnurl);

	if (!handoverurl.error && handoverurl.HandoverURL) {
		response.redirect(handoverurl.HandoverURL);
		return {
			redirected : true
		};
	} else {
		return {
			redirected : false
		};
	}

}

/**
 * Continue Openpay Checkout after redirect from Openpay server
 */
function continueOpenpay() {

	var order = Order.get(request.httpParameterMap.orderid.stringValue);
	var paymentInstrument = order.object.getPaymentInstrument();
	var paymentProcessor = PaymentMgr.getPaymentMethod(
			paymentInstrument.getPaymentMethod()).getPaymentProcessor();

	Transaction.begin();

	paymentInstrument.paymentTransaction.transactionID = order.object.orderNo;
	paymentInstrument.paymentTransaction.paymentProcessor = paymentProcessor;
	Transaction.commit();
	var orderPlacementStatus;
	if (order.object
			&& request.httpParameterMap.order_token.stringValue === order
					.getOrderToken()) {
		if (request.httpParameterMap.status.stringValue === "SUCCESS") {
			orderPlacementStatus = Order.submit(order.object);
			var statusresponse = i_status.sendStatus(order);
			if (!orderPlacementStatus.error) {
				session.forms.singleshipping.clearFormElement();
				session.forms.multishipping.clearFormElement();
				session.forms.billing.clearFormElement();
				return require(
						'app_storefront_controllers/cartridge/controllers/COSummary')
						.ShowConfirmation(order.object);
			}
		} else if (request.httpParameterMap.status.stringValue === "FAILURE"
				|| request.httpParameterMap.status.stringValue === "CANCELLED") {
			Transaction.begin();
			var stat = OrderMgr.failOrder(order.object);
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
	if (request.httpParameterMap.status.stringValue === "FAILURE"
			|| request.httpParameterMap.status.stringValue === "CANCELLED") {
		Transaction.begin();
		var stat = OrderMgr.failOrder(order.object);
		Transaction.commit();
	}
	require('app_storefront_controllers/cartridge/controllers/Home').Show();
}

function test() {
	var ServiceUtils = require("int_openpay_core/cartridge/scripts/services/GetPlanIDService.ds");
	//var param = ServiceUtils.requestBody();
	//var response = ServiceUtils.call(param);
	var response = ServiceUtils.call();
}

/*
 * Exposed web methods
 */
exports.Test = guard.ensure([ 'get' ], test);

exports.DoOpenpayCheckout = guard.ensure([ 'post' ], doOpenpayCheckout);

exports.ContinueOpenpay = guard.ensure([ 'https' ], continueOpenpay);

exports.FailOpenpay = guard.ensure([ 'https' ], failOpenpay);
