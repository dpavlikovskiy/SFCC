'use strict';

/**
 * Controller for Order management pages
 *
 */
/* Script Modules */
var app = require('~/cartridge/scripts/app'),
	guard = require('~/cartridge/scripts/guard'),
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

/*
 * Exposed web methods
 */

exports.OrderList = guard.ensure(['get'], orderList);
exports.OrderDetails = guard.ensure(['get'], orderDetails);