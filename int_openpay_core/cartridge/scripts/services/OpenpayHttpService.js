/**
*
*	Makes request
*   @param args {Object} 
*   @return {Object} parsedResponse 
*/

importPackage( dw.svc );
importPackage( dw.rpc );

var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
var ServiceUtils = require("int_openpay_core/cartridge/scripts/utils/OpenpayUtilities.js");
var serviceID : String = ServiceUtils.SERVICES.ServiceID;

module.exports = LocalServiceRegistry.createService(serviceID, {

	createRequest: function(service, params) {
	    service.setRequestMethod(ServiceUtils.CONFIG.SERVICE_METHOD_POST || 'POST');
	    service.addHeader(ServiceUtils.CONFIG.SERVICE_HEADER_CONTENT_TYPE, ServiceUtils.CONFIG.SERVICE_CONTENT_TYPE_XML);
	    service.setEncoding(ServiceUtils.CONFIG.SERVICE_ENCODING_UTF_8);
        service.setURL(service.configuration.credential.URL + params.method);
        //TODO Custom log file
        dw.system.Logger.debug('Openpay service=Request:  ' + params.body);
        return params.body;
    },
	parseResponse: function(service, responseObject) {
        //TODO Custom log file
		dw.system.Logger.debug('Openpay service=parseResponse  ' + responseObject.text);
        return responseObject.text;
    }
});