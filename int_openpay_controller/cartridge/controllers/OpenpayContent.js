'use strict';

/* API Includes */
var OrderMgr = require('dw/order/OrderMgr');
var URLUtils = require('dw/web/URLUtils');
var Pipeline = require('dw/system/Pipeline');
var PaymentMgr = require('dw/order/PaymentMgr');
var Transaction = require('dw/system/Transaction');

/* Script Modules */
var app = require('app_storefront_controllers/cartridge/scripts/app');
var guard = require('app_storefront_controllers/cartridge/scripts/guard');

function overview() {
	app.getView().render('util/contentpage');
}

/*
 * Export the publicly available controller methods
 */
exports.Overview = guard.ensure(['get'], overview);