'use strict';

/* API Includes */
var SystemObjectMgr = require('dw/object/SystemObjectMgr');
var OrderMgr = require('dw/order/OrderMgr');
var URLUtils = require('dw/web/URLUtils');
var Pipeline = require('dw/system/Pipeline');

var OpenUtils = require("int_openpay_core/cartridge/scripts/utils/OpenpayUtilities.js");
var sitePreferencesUtilities = OpenUtils.getSitePreferencesUtilities();
var ServiceUtils = require("int_openpay_core/cartridge/scripts/services/OpenpayHttpService.js");

var token = sitePreferencesUtilities.getJamAuthToken();

/* Script Modules */
var app = require('app_storefront_controllers/cartridge/scripts/app');
var guard = require('app_storefront_controllers/cartridge/scripts/guard');

var isSomeFlag;

exports.receivePlan = function ( order ) {	
	if (!order) return;
	
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
	
	xsw.close()
	
	var NewOnlineOrder = strwr.toString();
	
	//new XML(); 
	
	NewOnlineOrder.JamAuthToken = token;
	NewOnlineOrder.PurchasePrice = "250.00"

	var param = {};
	param.body = NewOnlineOrder;
	param.method =  OpenUtils.METHODS.NewOnlineOrder;
	var response = ServiceUtils.call(param);
}

/**
 * Prepare Openpay handover URL
 */
exports.prepare = function (order, planid) {
	 // building parameter
		var jamCallbackURL=dw.web.URLUtils.httpsContinue()
        var jamAuthToken=token;

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

        var handoverurl = sitePreferencesUtilities.getHandoverUrl();
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
	
	var param = {};
	param.body = strwr.toString();
	param.method =  OpenUtils.METHODS.OnlineOrderStatus;
	var response = ServiceUtils.call(param);
}



