'use strict';

/**********************************************************************************************************************************************************************************************
*
* TITLE:  
*
*	Get Plan ID
*
* INPUT PARAMETERS:
*
*	@input Order : dw.order.Order The order waiting for authorization
*
* OUTPUT PARAMETERS
*
* 	@output PlanID : String
*
**********************************************************************************************************************************************************************************************/

var OpenUtils = require("int_openpay_core/cartridge/scripts/utils/OpenpayUtilities.js");
var sitePreferences = OpenUtils.getSitePreferencesUtilities();
var ServiceUtils = require("int_openpay_core/cartridge/scripts/services/OpenpayHttpService.js");
var token = sitePreferences.getJamAuthToken();

function execute(pdict) {
	pdict.PlanID = getPlanID(pdict.Order).PlanID;
	return PIPELET_NEXT;
}

function getPlanID(order) {
	if (!order) {
		return {error: true};
	}
	
	if (order.totalGrossPrice.available) {
		var orderamount = order.totalGrossPrice.value;
	} else {
		var orderamount = order.getAdjustedMerchandizeTotalPrice(true).add(order.giftCertificateTotalPrice).value;
	}
	
	var strwr = new dw.io.StringWriter();
	var xsw = new dw.io.XMLStreamWriter(strwr);
	
	//xsw.writeStartDocument();
	xsw.writeStartElement("NewOnlineOrder");
		xsw.writeStartElement("JamAuthToken");
			xsw.writeCharacters(token);
	    xsw.writeEndElement();
		xsw.writeStartElement("PurchasePrice");
			xsw.writeCharacters(orderamount.toFixed(2));
	    xsw.writeEndElement();
	xsw.writeEndElement();
	//xsw.writeEndDocument();
	
	xsw.close()
	
	var param = {};
	param.body = strwr.toString();
	param.method =  OpenUtils.METHODS.NewOnlineOrder;
	var response = ServiceUtils.call(param);
	
	if (response.ok) {
		let parseXMLResponse = new XML(response.object);
		let status = parseXMLResponse.descendants('status');
		
		if (status.toString() != "0") {
			return {PlanID: null};
		}
		
		let planid = parseXMLResponse.descendants('PlanID').toString();
		if (planid != "") {
			return {PlanID: planid};
		}
	}
	
	return {PlanID: null};
}

module.exports = {
	getPlanID: getPlanID
}