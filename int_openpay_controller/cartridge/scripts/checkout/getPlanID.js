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

var token = dw.system.Site.getCurrent().getCustomPreferenceValue('openpayJamAuthToken');
var endpointurl = dw.system.Site.getCurrent().getCustomPreferenceValue('openpayEndpoint');
var timeout = dw.system.Site.getCurrent().getCustomPreferenceValue('openpayTimeout');
var http = require('dw/net/HTTPClient');

function execute(pdict) {
	pdict.PlanID = getPlanID(pdict.Order).PlanID;
	return PIPELET_NEXT;
}

function getPlanID(order) {
	if (!order) {
		return {error: true};
	}
	
	var method = "NewOnlineOrder";
	
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
	
	var NewOnlineOrder = strwr.toString();
	
	//new XML(); 

	var http = new dw.net.HTTPClient();
	
	http.setTimeout(timeout);
	http.open('POST',endpointurl + method);
	http.setRequestHeader('Content-type', 'application/xml; charset=utf-8');
	http.send(NewOnlineOrder);
	
	if ( (http.statusCode=='201' || http.statusCode=='200') && http.errorText==null && http.text!=null ) {
		var res = http.text;
		var status = res.substring(res.indexOf('<status>')+8,res.indexOf('</status>'));
		
		if (status != "0") {
			return {PlanID: null};
		}
		
		var planid = res.substring(res.indexOf('<PlanID>')+8,res.indexOf('</PlanID>'));
		
		if (planid != "") {
			return {PlanID: planid};
		}
	}
	return {PlanID: null};
	
	
}

module.exports = {
	getPlanID: getPlanID
}