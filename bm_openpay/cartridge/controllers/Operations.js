'use strict';

/**
 * Controller for OpenPay payment
 *
 */

var sitePreferences = require("~/cartridge/scripts/util/OpenpayUtilities.js").getSitePreferencesUtilities();
var ctrlCartridgeName = sitePreferences.getControllerCartridgeName();

/* Script Modules */
var app = require(ctrlCartridgeName + '/cartridge/scripts/app');
var guard = require(ctrlCartridgeName + '/cartridge/scripts/guard');

var LogUtils = require('~/cartridge/scripts/util/LogUtils');

var log = LogUtils.getLogger("Operations");

/**
 * redirects to specific actions
 * */
function performAction(){
	var action = request.httpParameterMap.action.value,
		orderNo = request.httpParameterMap.orderno.value,
		amount = request.httpParameterMap.amount.value,
		bulkCompleteArray = request.httpParameterMap.bulkComplete.value,
		transActions = require("~/cartridge/scripts/TransActions"),
		result;
	
	switch(action){
		case "refund":
			result = transActions.refund(orderNo, amount);
			break;
	}
	
	response.getWriter().println(JSON.stringify(result));
}

/*
 * Exposed web methods
 */

exports.Action = guard.ensure(['post'], performAction);
