'use strict';

var Site = require('dw/system/Site');

var OpenpayUtils = {
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
		},
		getAuthToken: function() {
			return Site.getCurrent().getCustomPreferenceValue('openpayJamAuthToken');
		},
		
		getJamAuthToken: function() {
			return Site.getCurrent().getCustomPreferenceValue('openpayMerchantID') + '|' + this.getAuthToken();
		}
	};
module.exports=OpenpayUtils;