'use strict';

/**
 * Controller for OpenPay payment
 *
 */

/* Script Modules */
var guard = require('~/cartridge/scripts/guard');

var LogUtils = require('~/cartridge/scripts/util/LogUtils');
var logger = LogUtils.getLogger("Operations");

/**
 * redirects to specific actions
 * */
function performAction(){
	let params = request.httpParameterMap; 
	let orderNo = params.isParameterSubmitted("orderno") ? params.orderno.value : "";
	let planID = params.isParameterSubmitted("planID") ? params.planID.value : "";
	let amount = params.isParameterSubmitted("amount") ? params.amount.value : "";
	let fullRefund = params.isParameterSubmitted("fullRefund") ? params.fullRefund.value : "";
	let action = "refund";
	
	if (orderNo === '' || planID === '' || amount === '' || fullRefund === '') {
		Logger.error("Exception in Operation-performAction: Some parameters are empty");
        return;
	}
	var transActions = require("bm_openpay/cartridge/scripts/TransActions.js"),
		result;
	switch(action){
		case "refund":
			result = transActions.refund(orderNo, planID, amount, fullRefund);
			break;
	}
	
	response.getWriter().println(JSON.stringify(result));
}

/*
 * Exposed web methods
 */

exports.Action = guard.ensure(['post'], performAction);
