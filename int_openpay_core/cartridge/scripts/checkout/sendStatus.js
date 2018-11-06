'use strict';

/**********************************************************************************************************************************************************************************************
*
* TITLE:  
*
*	Send Order Status
*
* INPUT PARAMETERS:
*
*	@input Order : dw.order.Order The order
*
* OUTPUT PARAMETERS
*
* 	#none
*
**********************************************************************************************************************************************************************************************/

var OpenUtils = require("int_openpay_core/cartridge/scripts/utils/OpenpayUtilities.js");
var sitePreferences = OpenUtils.getSitePreferencesUtilities();
var ServiceUtils = require("int_openpay_core/cartridge/scripts/services/OpenpayHttpService.js");
var token = sitePreferences.getJamAuthToken();

function execute(pdict) {
	var statusresponse = sendStatus(pdict.Order);
	return PIPELET_NEXT;
}

/**
 * Sends DW order status to Openpay
 */
function sendStatus(order) {
	if (!order) return;
	
	var strwr = new dw.io.StringWriter();
	var xsw = new dw.io.XMLStreamWriter(strwr);
	
	//xsw.writeStartDocument();
	xsw.writeStartElement("OnlineOrderStatus");
		xsw.writeStartElement("JamAuthToken");
			xsw.writeCharacters(token);
	    xsw.writeEndElement();
		xsw.writeStartElement("PlanID");
			xsw.writeCharacters(order.custom.openpayPlanID);
	    xsw.writeEndElement();
	xsw.writeEndElement();
	//xsw.writeEndDocument();
	
	xsw.close()
	
	var param = {};
	param.body = strwr.toString();
	param.method =  OpenUtils.METHODS.OnlineOrderStatus;
	var response = ServiceUtils.call(param);
	
	if (response.ok) {
		let parseXMLResponse = new XML(response.object);
		let orderStatus = parseXMLResponse.descendants('OrderStatus');
		let planStatus = parseXMLResponse.descendants('PlanStatus');
		let status = parseXMLResponse.descendants('status');
		
		if (status != "0") {
			let reason = parseXMLResponse.descendants('reason');
			return {
				Success: false,
				Status: status.toString(),
				Reason: reason.toString()
			};
		} else {
			return {
				Success : true,
				orderStatus: orderStatus.toString(),
				planStatus : planStatus.toString()
			};
		}
	}
	
	return null;	
}

module.exports = {
	sendStatus: sendStatus
}