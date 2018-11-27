/**
* Openpay Transaction Actions
*
* @input Action: String
* @input OrderNo: String
* @input Amount: String
*
*/
importPackage( dw.system );
importPackage( dw.net );
importPackage( dw.io );

/* API Includes */
var OrderMgr = require('dw/order/OrderMgr');
var Transaction = require('dw/system/Transaction');

var OpenpayUtils = require("~/cartridge/scripts/util/OpenpayUtilities.js");

/* Script Modules */
var LogUtils = require('~/cartridge/scripts/util/LogUtils');
var Logger = LogUtils.getLogger('TransActions');

function execute( pdict : PipelineDictionary ) : Number
{
	var action = pdict.Action,
		orderNo = pdict.OrderNo,
		planID = pdict.PlanID,
		amount = parseFloat(pdict.Amount, 10),
		fullRefund = pdict.fullRefund,
		result;
	
	switch(action){
		case "refund":
			result = refund(orderNo, planID, amount, fullRefund);
			break;
	}
	
	response.getWriter().println(JSON.stringify(result));
	
	return PIPELET_NEXT;
}

/**
 * Refund action
 * */
function refund(orderNo, planID, amount, fullRefund){
	var ServiceUtils = require("~/cartridge/scripts/services/OpenpayHttpService.js");
	var param = {};
	param.body = getRequestBody(planID, amount, fullRefund);
	param.method =  OpenpayUtils.METHODS.OnlineOrderReduction;
	var response = ServiceUtils.call(param);
	
	try {
		if (response.ok) {
			let parseXMLResponse = new XML(response.object);
			let status = parseXMLResponse.descendants('status');
			if (status.toString() == "0") {
				updateOrderStatus(orderNo, amount, fullRefund);
				return {
					success : true
				};
			} else {
				let reason = parseXMLResponse.descendants('reason');
				return {
					success: false,
					error: reason.toString()
				};	
			}
		}
	} catch(e) {
		Logger.error("Exception occured while calling the Service: "+e);
	}
}

function getRequestBody(planID, amount, fullRefund) {
	var strwr = new dw.io.StringWriter();
	var xsw = new dw.io.XMLStreamWriter(strwr);
	//xsw.writeStartDocument();
	xsw.writeStartElement("OnlineOrderReduction");
	xsw.writeStartElement("JamAuthToken");
	xsw.writeCharacters(OpenpayUtils.getJamAuthToken());
    xsw.writeEndElement();
    xsw.writeStartElement("AuthToken");
    xsw.writeCharacters(OpenpayUtils.getAuthToken());
    xsw.writeEndElement();
    xsw.writeStartElement("PlanID");
	xsw.writeCharacters(planID);
    xsw.writeEndElement();
	xsw.writeStartElement("NewPurchasePrice");
	xsw.writeCharacters('0.00');
	xsw.writeEndElement();
	xsw.writeStartElement("ReducePriceBy");
	xsw.writeCharacters(amount);
	xsw.writeEndElement();
	xsw.writeStartElement("FullRefund");
	xsw.writeCharacters(fullRefund);
	xsw.writeEndElement();
	xsw.writeEndElement();
	
	xsw.close();
	return strwr.toString();
}


/**
 * updates the order status
 * */
function updateOrderStatus(orderNo, amount, fullRefund){
	var Order = OrderMgr.getOrder(orderNo);

	var refundedHistory = [];
	var today = new Date();
	try{
		if (Order.custom.openpayRefundHistory) {
			var refundedHistory = JSON.parse(Order.custom.openpayRefundHistory);
		}
		refundedHistory.push({date:today.toString(),value:amount});
		Transaction.begin();
		if (fullRefund == 'true') {
            Order.custom.openpayPlanStatus = 'Finished';
		}
		Order.custom.openpayRefundHistory = JSON.stringify(refundedHistory);
	    Transaction.commit();
	    
	}catch(e){
		Transaction.rollback();
		Logger.error("Exception occured while updating the order status after Refund Transaction"+e);
	}
}

/**
 * Internal methods
 */
exports.refund = function(orderNo, planID, amount, fullRefund){
	return refund(orderNo, planID, amount, fullRefund);
};