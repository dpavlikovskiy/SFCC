/**
*
*	Makes request
*   @param args {Object} 
*   @return {Object} parsedResponse 
*/

importPackage( dw.svc );
importPackage( dw.rpc );

var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
var ServiceUtils = require("~/cartridge/scripts/util/OpenpayUtilities.js");
var serviceID : String = ServiceUtils.SERVICES.ServiceID;
/* Script Modules */
var LogUtils = require('~/cartridge/scripts/util/LogUtils');
var Logger = LogUtils.getLogger('TransActions');

module.exports = LocalServiceRegistry.createService(serviceID, {

	createRequest: function(service, params) {
	    service.setRequestMethod(ServiceUtils.CONFIG.SERVICE_METHOD_POST || 'POST');
	    service.addHeader(ServiceUtils.CONFIG.SERVICE_HEADER_CONTENT_TYPE, ServiceUtils.CONFIG.SERVICE_CONTENT_TYPE_XML);
	    service.setEncoding(ServiceUtils.CONFIG.SERVICE_ENCODING_UTF_8);
        service.setURL(service.configuration.credential.URL + params.method);
        Logger.debug('Openpay service=Request:  ' + params.body);
        return params.body;
    },
	parseResponse: function(service, responseObject) {
		Logger.debug('Openpay service=parseResponse  ' + responseObject.text);
        return responseObject.text;
    }
});