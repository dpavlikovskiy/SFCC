'use strict';

var ctrlCartridgeName = dw.system.Site.getCurrent().getCustomPreferenceValue('openpayControllerCartridge');
var Class = require(ctrlCartridgeName + '/cartridge/scripts/util/Class').Class;
var Site = require('dw/system/Site');

var createOpenpayWebServiceUtilities = Class.extend({

    setSASAuthorization: function (svc : dw.svc.Service) {
        var apMerchantID = svc.configuration.credential.user || '';
        var apMerchantKey = svc.configuration.credential.password || '';
        var auth : String = [apMerchantID, apMerchantKey].join(':');
        var authCodeByte = dw.util.Bytes(auth);
        var authCode = 'Basic ' + dw.crypto.Encoding.toBase64(authCodeByte);

        svc.setAuthentication('BASIC');
        svc.addHeader('Authorization', authCode);
    }
});

var getOpenpayWebServiceUtilities = function() {
	var OpenpayWebServiceUtilities = createOpenpayWebServiceUtilities;
	return new OpenpayWebServiceUtilities();
}

module.exports.getOpenpayWebServiceUtilities = getOpenpayWebServiceUtilities;

// Checkout Utilities
var createOpenpayCheckoutUtilities = Class.extend({
	
	PAYMENT_MODE : require("~/cartridge/scripts/util/OpenpayConstants.js").PAYMENT_MODE,
	
	getPaymentMethod : function () {
		return dw.order.PaymentMgr.getPaymentMethod(this.PAYMENT_MODE.PAYMENT_METHOD);
	},
	
	getPaymentTransaction : function (lineItemCtnr : dw.order.LineItemCtnr) {
		var paymentInstrument = this.getPaymentInstrument(lineItemCtnr);
		return empty(paymentInstrument) ? null : paymentInstrument.getPaymentTransaction();
	},
	
	getPaymentInstrument : function (lineItemCtnr : dw.order.LineItemCtnr) {
		return lineItemCtnr.getPaymentInstruments(this.PAYMENT_MODE.PAYMENT_METHOD)[0]; 
	}
	
	/*getPaymentModeFromOrder : function (order : dw.order.Order) {
		if (empty(order)) {
			return null;
		}
		
		var paymentTransaction = this.getPaymentTransaction(order);
		return paymentTransaction.custom.apPaymentMode;
	},
	
	getPaymentMode : function (order : dw.order.Order) {
		var paymentMode = this.getPaymentModeFromOrder(order);
	   	if (empty(paymentMode)) {
	   		var sitePreferencesUtilities = getSitePreferencesUtilities();
	   	    paymentMode = sitePreferencesUtilities.getPaymentMode().value;
	   	}
	   	return paymentMode;
	}*/
});

var getOpenpayCheckoutUtilities = function () {
	var OpenpayCheckouttilities = createOpenpayCheckoutUtilities;
	return new OpenpayCheckouttilities();	
} 

module.exports.getOpenpayCheckoutUtilities = getOpenpayCheckoutUtilities;

// Site Preferences Utilities
var createOpenpaySitePreferencesUtilities = Class.extend({

    /*getRedirectConfirmUrl: function() {
    	
        return dw.web.URLUtils.https(Site.current.preferences.custom.apHandleResponseURL).toString();
    },

    getRedirectCancelUrl: function() {
        return dw.web.URLUtils.https(Site.current.preferences.custom.apHandleResponseURL).toString();
    },*/

    /*getPaymentMode: function() {
        return Site.current.preferences.custom.apPaymentMode;
    },*/
    
    /*getServiceName: function() {
    	return Site.current.preferences.custom.apServiceName;
    },*/
    
    isDisplayPdpInfo : function () {
    	return Site.getCurrent().getCustomPreferenceValue('isOpenpayShowOnproduct');	
    },
    
    isDisplayPlpInfo : function () {
    	return Site.getCurrent().getCustomPreferenceValue('isOpenpayShowOncategory');
    },
    
    getControllerCartridgeName: function() {
    	return Site.getCurrent().getCustomPreferenceValue('openpayControllerCartridge');
    },
    
    getCoreCartridgeName: function() {
    	return Site.getCurrent().getCustomPreferenceValue('openpayCoreCartridge');
    },
    
    /*getUserAgent: function() {
    	return Site.getCurrent().getCustomPreferenceValue('apUserAgent');
    },
    
    getCaptureTimeout: function() {
    	return Site.getCurrent().getCustomPreferenceValue('apCaptureTimeout');
    },*/
    
    isOpenpayEnabled : function () {
    	return Site.getCurrent().getCustomPreferenceValue('enableOpenpay') || false;
    },
    
});

var getSitePreferencesUtilities = function() {
	var SitePreferences = createOpenpaySitePreferencesUtilities;
	return new SitePreferences();
};

module.exports.getSitePreferencesUtilities = getSitePreferencesUtilities;