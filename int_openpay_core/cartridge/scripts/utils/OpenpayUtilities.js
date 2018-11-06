'use strict';

var Site = require('dw/system/Site');
var ctrlCartridgeName = dw.system.Site.getCurrent().getCustomPreferenceValue('openpayControllerCartridge');
var Class = require(ctrlCartridgeName + '/cartridge/scripts/util/Class').Class;

// Site Preferences Utilities
var createOpenpaySitePreferencesUtilities = Class.extend({
	isOpenpayEnabled : function () {
		return Site.getCurrent().getCustomPreferenceValue('isOpenpayEnabled');
	},
	getOpenpayWidgetFormat : function (openpayWidgetFormat) {
		return Site.getCurrent().getCustomPreferenceValue(openpayWidgetFormat).value || 'categoryOpenpayWidgetFormat';
	},
	getOpenpayMinPrice : function () {
		return Site.getCurrent().getCustomPreferenceValue('openpayMinPrice') || '3';
	},
	getOpenpayMaxPrice : function () {
		return Site.getCurrent().getCustomPreferenceValue('openpayMaxPrice') || '10000';
	},
	getOpenpayWidgetStyle : function () {
		return Site.getCurrent().getCustomPreferenceValue('openpayWidgetStyle') || 'font-family: inherit; color: inherit; font-size: inherit;';
	},
	getOpenpayCheckoutWidgetStyle : function () {
		return Site.getCurrent().getCustomPreferenceValue('openpayCheckoutWidgetStyle') || 'font-family: inherit; color: inherit; font-size: inherit;';
	},
	getOpenpayBrandLink : function () {
		return Site.getCurrent().getCustomPreferenceValue('openpayBrandLink') || 'font-family: inherit; color: inherit; font-size: inherit;';
	},
	getOpenpayPlanDuration : function () {
		return Site.getCurrent().getCustomPreferenceValue('openpayPlanDuration') || '2';
	},
	getOpenpayTwoPlanDuration : function () {
		return Site.getCurrent().getCustomPreferenceValue('openPaySelectTwoPlans') || '2';
	},
	isOpenpayShowOnPage : function (context) {
		var isDisplayPage= 'isOpenpayShowOn'+context;
		return Site.getCurrent().getCustomPreferenceValue(isDisplayPage);
	},
//	isOpenpayLearnMore : function () {
//		return Site.getCurrent().getCustomPreferenceValue() || true;
//	},
	getOpenpayAcceleratorTagLine : function () {
		return Site.getCurrent().getCustomPreferenceValue('openpayAcceleratorText') || 'Spend an additional {0} and use Openapy to pay over time interest free.';
	},
	getInfoLink : function () {
		return Site.getCurrent().getCustomPreferenceValue('openpayInfoLink') ? Site.getCurrent().getCustomPreferenceValue('openpayInfoLink').value : 'learnMore';
	},
	getLogoStyle : function () {
		return Site.getCurrent().getCustomPreferenceValue('openpayLogoType') ? Site.getCurrent().getCustomPreferenceValue('openpayLogoType').value : 'Color';
	},
	getWidgetTextType2 : function () {
		return Site.getCurrent().getCustomPreferenceValue('openpayWidgetTextType2') || 'Or buy now and pay later with';
	},
	getWidgetTextType1 : function () {
		return Site.getCurrent().getCustomPreferenceValue('openpayWidgetTextType1') || 'Or {0} payments of ${1} with Openpay';
	},
	getCheckoutWidgetText : function () {
		return Site.getCurrent().getCustomPreferenceValue('checkoutWidgetText') || 'Or {0} payments of ${1} with Openpay';
	},
	getAuthToken: function() {
		return Site.getCurrent().getCustomPreferenceValue('openpayJamAuthToken') || '';
    },
    getJamAuthToken: function() {
    	return Site.getCurrent().getCustomPreferenceValue('openpayMerchantID') + '|' + this.getAuthToken();
    },
    getHandoverUrl: function() {
    	return Site.getCurrent().getCustomPreferenceValue('openpayHandoverURL');
    },
    getEndpoint: function() {
    	return Site.getCurrent().getCustomPreferenceValue('openpayEndpoint');
    }
//	isOpenpayShowOnCheckout : function () {
//		return Site.getCurrent().getCustomPreferenceValue('isOpenpayShowOnCheckout') || true;
//	}
});

var getSitePreferencesUtilities = function() {
   var SitePreferences = createOpenpaySitePreferencesUtilities;
   return new SitePreferences();
};

var OpenpayUtilities = {
	/**
	 * Services Urls, mapped with business manager. 	
	 */			
	SERVICES : {
		ServiceID : "openpay"
	},
	/**
	 * Service methods name. 	
	 */		
	METHODS : {
		NewOnlineOrder	: "NewOnlineOrder",
		OnlineOrderReduction : "OnlineOrderReduction",
		OnlineOrderStatus : "OnlineOrderStatus"
	},
	CONFIG : {
		SERVICE_ENCODING_UTF_8 : 'UTF-8',
		SERVICE_METHOD_POST : 'POST',
		SERVICE_HEADER_CONTENT_TYPE : 'Content-Type',
		SERVICE_CONTENT_TYPE_XML : 'text/xml;charset=UTF-8'
	}
};	

module.exports=OpenpayUtilities;
module.exports.getSitePreferencesUtilities = getSitePreferencesUtilities;