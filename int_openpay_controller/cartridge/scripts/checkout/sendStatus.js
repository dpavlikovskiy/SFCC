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

var token = dw.system.Site.getCurrent().getCustomPreferenceValue('openpayJamAuthToken');
var endpointurl = dw.system.Site.getCurrent().getCustomPreferenceValue('openpayEndpoint');
var timeout = dw.system.Site.getCurrent().getCustomPreferenceValue('openpayTimeout');
var http = require('dw/net/HTTPClient');

function execute(pdict) {
	var statusresponse = sendStatus(pdict.Order);
	return PIPELET_NEXT;
}

/**
 * Sends DW order status to Openpay
 */
function sendStatus(order) {
	if (!order) return;
	
	var method = "OnlineOrderStatus";
	
	
	var strwr = new dw.io.StringWriter();
	var xsw = new dw.io.XMLStreamWriter(strwr);
	
	//xsw.writeStartDocument();
	xsw.writeStartElement("OnlineOrderStatus");
		xsw.writeStartElement("JamAuthToken");
			xsw.writeCharacters(token);
	    xsw.writeEndElement();
		xsw.writeStartElement("PlanID");
			xsw.writeCharacters(order.object.custom.openpayPlanID);
	    xsw.writeEndElement();
	xsw.writeEndElement();
	//xsw.writeEndDocument();
	
	xsw.close()
	
	var OnlineOrderStatus = strwr.toString();
	
	//new XML(); 

	var http = new dw.net.HTTPClient();
	
	http.setTimeout(timeout);
	http.open('POST',endpointurl + method);
	http.setRequestHeader('Content-type', 'application/xml; charset=utf-8');
	http.send(OnlineOrderStatus);
	
	if ( (http.statusCode=='201' || http.statusCode=='200') && http.errorText==null && http.text!=null ) {
		var res = http.text;
		var status = res.substring(res.indexOf('<status>')+8,res.indexOf('</status>'));
		
		if (status != "0") {
			var reason = res.substring(res.indexOf('<reason>')+8,res.indexOf('</reason>'));
			return {
				Success: false,
				Status: status,
				Reason: reason
			};
		} else {
			return {
				Success: true
			};
		}
	}
	
	return null;	
}

module.exports = {
	sendStatus: sendStatus
}