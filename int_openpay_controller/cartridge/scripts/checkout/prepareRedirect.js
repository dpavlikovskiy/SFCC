/**********************************************************************************************************************************************************************************************
*
* TITLE:  
*
*	Prepare Redirect
*
* INPUT PARAMETERS:
*
*	@input Order : dw.order.Order The order waiting for authorization
*	@input PlanID : String Openpay PlanID
*	@input ReturnURL : dw.web.URL CallbackURL
* 
*
* OUTPUT PARAMETERS
*
* 	@output HandoverURL : String
*
**********************************************************************************************************************************************************************************************/

var token = dw.system.Site.getCurrent().getCustomPreferenceValue('openpayJamAuthToken');
var timeout = dw.system.Site.getCurrent().getCustomPreferenceValue('openpayTimeout');
var hourl = dw.system.Site.getCurrent().getCustomPreferenceValue('openpayHandoverURL');
var http = require('dw/net/HTTPClient');

var Transaction = require('dw/system/Transaction');

function execute(pdict) {
	pdict.HandoverURL = prepare(pdict.Order,pdict.PlanID,pdict.ReturnURL).HandoverURL;
	return PIPELET_NEXT;
}



function prepare(order,planid,returnurl) {
	if (!order || !planid) {
		return {error: true};
	}
	// building parameter
	var jamCallbackURL=returnurl.toString();
    var jamAuthToken="30000000000000895|cd8ddfd7-1033-4b93-8cd4-a43bce121747";

	var jamPlanID=planid;
    var jamRetailerOrderNo=order.orderNo;
    var jamPrice=order.getAdjustedMerchandizeTotalPrice().value.toFixed(2);
    
    var jamFailURL=dw.web.URLUtils.https('OpenpayCheckout-FailOpenpay');
    var jamCancelURL=dw.web.URLUtils.https('OpenpayCheckout-FailOpenpay');
    
    var jamFirstName=order.getBillingAddress().firstName;
    var jamOtherNames="";
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

    var handoverurl = hourl;
    handoverurl += "?JamCallbackURL=" + encodeURIComponent(jamCallbackURL);
    handoverurl += "&JamCancelURL=" + encodeURIComponent(jamCancelURL);
    handoverurl += "&JamFailURL=" + encodeURIComponent(jamFailURL);
    handoverurl += "&JamAuthToken=" + encodeURIComponent(jamAuthToken);
    handoverurl += "&JamPlanID=" + encodeURIComponent(jamPlanID);
    
    handoverurl += "&JamRetailerOrderNo=" + encodeURIComponent(jamRetailerOrderNo);
    handoverurl += "&JamPrice=" + encodeURIComponent(jamPrice);
    
    handoverurl += "&JamFirstName=" + encodeURIComponent(jamFirstName);
    handoverurl += "&JamOtherNames=" + encodeURIComponent(jamOtherNames);
    handoverurl += "&JamFamilyName=" + encodeURIComponent(jamFamilyName);
    handoverurl += "&JamEmail=" + encodeURIComponent(jamEmail);
    handoverurl += "&JamDateOfBirth=" + encodeURIComponent(jamDateOfBirth);
    handoverurl += "&JamAddress1=" + encodeURIComponent(jamAddress1);
    handoverurl += "&JamAddress2=" + encodeURIComponent(jamAddress2);
    handoverurl += "&JamSuburb=" + encodeURIComponent(jamSuburb);
    handoverurl += "&JamState=" + encodeURIComponent(jamState);
    handoverurl += "&JamPostCode=" + encodeURIComponent(jamPostCode);
    
    Transaction.begin();
    order.custom.openpayPlanID = planid;
    Transaction.commit();
    
    return {HandoverURL: handoverurl};
		
}

module.exports = {
	prepare: prepare
}