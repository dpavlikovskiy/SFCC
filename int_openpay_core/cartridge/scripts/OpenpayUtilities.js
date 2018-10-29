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
	getOpenpayBrandLink : function () {
		return Site.getCurrent().getCustomPreferenceValue('openpayBrandLink') || 'font-family: inherit; color: inherit; font-size: inherit;';
	},
	getOpenpayPlanDuration : function () {
		return Site.getCurrent().getCustomPreferenceValue('openpayPlanDuration') || '2';
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
	}
//	isOpenpayShowOnCheckout : function () {
//		return Site.getCurrent().getCustomPreferenceValue('isOpenpayShowOnCheckout') || true;
//	}
});

var getSitePreferencesUtilities = function() {
   var SitePreferences = createOpenpaySitePreferencesUtilities;
   return new SitePreferences();
};

module.exports.getSitePreferencesUtilities = getSitePreferencesUtilities;