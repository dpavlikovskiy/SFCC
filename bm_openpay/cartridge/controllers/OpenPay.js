'use strict';

/**
 * Controller for Order management pages
 *
 */

/* API Includes */
var OrderMgr = require('dw/order/OrderMgr');
var URLUtils = require('dw/web/URLUtils');
var Pipeline = require('dw/system/Pipeline');
var PaymentMgr = require('dw/order/PaymentMgr');
var Transaction = require('dw/system/Transaction');

var sitePreferences = require("~/cartridge/scripts/util/OpenpayUtilities.js").getSitePreferencesUtilities();
var ctrlCartridgeName = sitePreferences.getControllerCartridgeName();

/* Script Modules */
var app = require(ctrlCartridgeName + '/cartridge/scripts/app'),
	guard = require(ctrlCartridgeName + '/cartridge/scripts/guard'),
	LogUtils = require('~/cartridge/scripts/util/LogUtils'),
	Logger = LogUtils.getLogger("Openpay");

/**
 * OpenPay Order List page
 * */
function orderList(){
	var pageSize = request.httpParameterMap.pagesize.value,
	pageNumber = request.httpParameterMap.pagenumber.value,
	orderNumber = request.httpParameterMap.ordernumber.value || "",
	orderListResponse;

	pageSize = pageSize ? parseInt(pageSize, 10) : 10;
	pageNumber = pageNumber ? parseInt(pageNumber, 10) : 1;
	
	orderListResponse = require('~/cartridge/scripts/getOrders').output({
		pageSize: pageSize,
		pageNumber: pageNumber,
		orderNumber: orderNumber
	});
	
	app.getView(orderListResponse).render("application/orderlist");
}

/**
 * OpenPay Order Details page
 * */
function orderDetails(){
	app.getView().render("application/orderdetails");
}
function documentation(){
	app.getView().render("application/documentation");
}
/*
 * Exposed web methods
 */

exports.OrderList = guard.ensure(['get'], orderList);
exports.OrderDetails = guard.ensure(['get'], orderDetails);
//exports.Documentation = guard.ensure(['get'], documentation);