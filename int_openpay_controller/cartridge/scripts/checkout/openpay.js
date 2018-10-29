'use strict';

/* API Includes */
var SystemObjectMgr = require('dw/object/SystemObjectMgr');
var OrderMgr = require('dw/order/OrderMgr');
var URLUtils = require('dw/web/URLUtils');
var Pipeline = require('dw/system/Pipeline');

var token = "30000000000000895|cd8ddfd7-1033-4b93-8cd4-a43bce121747"; //dw.system.Site.getCurrent().getCustomPreferenceValue('to1');
var endpointurl = "https://retailer.myopenpay.com.au/ServiceTraining/JAMServiceImpl.svc/"; //dw.system.Site.getCurrent().getCustomPreferenceValue('to2');
var handoverurl = "https://retailer.myopenpay.com.au/WebSalesTraining/";
var timeout = 10000; //dw.system.Site.getCurrent().getCustomPreferenceValue('to3');
var http = require('dw/net/HTTPClient');

/* Script Modules */
var app = require('app_storefront_controllers/cartridge/scripts/app');
var guard = require('app_storefront_controllers/cartridge/scripts/guard');

var isSomeFlag;

exports.receivePlan = function ( order ) {
	
	if (!order) return;
	
	var method = "NewOnlineOrder";
	var orderamount = order.getAdjustedMerchandizeTotalPrice().value;
	
	
	var strwr = new dw.io.StringWriter();
	var xsw = new dw.io.XMLStreamWriter(strwr);
	
	//xsw.writeStartDocument();
	xsw.writeStartElement("NewOnlineOrder");
		xsw.writeStartElement("JamAuthToken");
			xsw.writeCharacters(token);
	    xsw.writeEndElement();
		xsw.writeStartElement("PurchasePrice");
			xsw.writeCharacters("250.99");
	    xsw.writeEndElement();
	xsw.writeEndElement();
	//xsw.writeEndDocument();
	
	xsw.close()
	
	var NewOnlineOrder = strwr.toString();
	
	//new XML(); 
	
	NewOnlineOrder.JamAuthToken = token;
	NewOnlineOrder.PurchasePrice = "250.00"

	var http = new dw.net.HTTPClient();
	
	http.setTimeout(timeout);
	http.open('POST',endpointurl + method);
	http.setRequestHeader('Content-type', 'application/xml; charset=utf-8');
	var test = NewOnlineOrder;
	http.send(NewOnlineOrder);
	
	if ( (http.statusCode=='201' || http.statusCode=='200') && http.errorText==null && http.text!=null ) {
		var res = http.text;
		var status = res.substring(res.indexOf('<status>')+8,res.indexOf('</status>'));
		
		if (status != "0") {
			return null;
		}
		
		var planid = res.substring(res.indexOf('<PlanID>')+8,res.indexOf('</PlanID>'));
		
		if (planid != "") {
			return planid;
		}
	}
	
	return null;
}

/**
 * Prepare Openpay handover URL
 */
exports.prepare = function (order, planid) {
	 // building parameter
		var jamCallbackURL=dw.web.URLUtils.httpsContinue()
        var jamAuthToken="30000000000000895|cd8ddfd7-1033-4b93-8cd4-a43bce121747";

    	var jamPlanID=planid;
        var jamRetailerOrderNo=order.orderNo;
        var jamPrice=order.getAdjustedMerchandizeTotalPrice().value.toFixed(2);
        
        var jamFailURL=dw.web.URLUtils.https('COBilling-Start');  // TODO
        var jamCancelURL=dw.web.URLUtils.https('COBilling-Start');  // TODO
        
        var jamFirstName=order.getBillingAddress().firstName;
        var jamOtherNames=order.getBillingAddress().secondName;
        var jamFamilyName=order.getBillingAddress().lastName;

        var jamEmail=order.customerEmail;
        var jamDateOfBirth="";
        if (order.customer.authenticated && order.customer.profile != null && order.customer.profile.birthday != null) {
        	JamDateOfBirth=order.customer.profile.birthday.toString();
        }

        var jamAddress1=order.getBillingAddress().address1;
        var jamAddress2=order.getBillingAddress().address2;
        var jamSuburb="";
        var jamState=order.getBillingAddress().stateCode;
        var jamPostCode=order.getBillingAddress().postalCode;

        var handoverurl = "https://retailer.myopenpay.com.au/WebSalesTraining/";
        handoverurl += "?JamCallbackURL=" + jamCallbackURL;
        handoverurl += "&JamCancelURL=" + jamCancelURL;
        handoverurl += "&JamFailURL=" + jamFailURL;
        handoverurl += "&JamAuthToken=" + jamAuthToken;
        handoverurl += "&JamPlanID=" + jamPlanID;
        
        handoverurl += "&JamRetailerOrderNo=" + jamRetailerOrderNo;
        handoverurl += "&JamPrice=" + jamPrice;
        
        handoverurl += "&JamFirstName=" + jamFirstName;
        handoverurl += "&JamOtherNames=" + jamOtherNames;
        handoverurl += "&JamFamilyName=" + jamFamilyName;
        handoverurl += "&JamEmail=" + jamEmail;
        handoverurl += "&JamDateOfBirth=" + jamDateOfBirth;
        handoverurl += "&JamAddress1=" + jamAddress1;
        handoverurl += "&JamAddress2=" + jamAddress2;
        handoverurl += "&JamSuburb=" + jamSuburb;
        handoverurl += "&JamState=" + jamState;
        handoverurl += "&JamPostCode=" + jamPostCode;
        

        return handoverurl;
        
}

/**
 * Sends DW order status to Openpay
 */
exports.sendOrderStatus = function ( order ) {
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
			xsw.writeCharacters(order.custom.openpay_planid);
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
	http.send(NewOnlineOrder);
	
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



