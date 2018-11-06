'use strict';

(function($){
	var trans = {
		init: function(){
			if($('.openpay-module .operations-holder').length){
				this.transOperationsEvents();
			}
		},
		transOperationsEvents: function(){
			$('.transaction-actions').on('click', function(){
				$('.operations-holder').toggle();
			});
			$('.operations-holder button').on('click', function(){
				var button = $(this),
					buttonLabel = button.text(),
					orderno = $('input[name=orderno]').val(),
					planID = $('input[name=planID]').val(),
					amount = parseFloat($('input[name=amount]').val()),
					total = parseFloat($('input[name=total]').val()),
					refundHistory = $('input[name=amount]').data('refundhistory'),
					refundedAmount = 0,
					fullRefund = false,
					url, postData;
				
				if(amount <= 0.0 || amount > total){
					$('.operations-holder .error').text(Resources.INVALID_REFUND_AMOUNT);
					return false;
				}
			    if (refundHistory) {
					$.each(refundHistory, function (index, refundAmount) {
						refundedAmount = refundedAmount + parseFloat(refundAmount.value);
					});					
					if((refundedAmount + amount) > total){
						var maxRefundAmount = total - refundedAmount;
						$('.operations-holder .error').text(Resources.MAXIMUM_REFUND_AMOUNT + maxRefundAmount.toFixed(2));
						return false;
					}
			    }
			    if ((refundedAmount + amount) === total) {
					fullRefund = true;
				}
			    
				$('.operations-holder .error').text("");
				url = Urls.operationActions;
				postData = {
					orderno: orderno,
					planID: planID,
					amount: amount,
					fullRefund: fullRefund
				};

				button.prop("disabled", true);
				button.text(Resources.TRANSACTION_PROCESSING);

				$.post(url, postData, function(data,status){
					var result = data ? JSON.parse(data) : {};
					
					button.prop("disabled", false);
					button.text(buttonLabel);

					if(result && result.success){
						alert(Resources.TRANSACTION_SUCCESS);
						window.location.reload();
					}
					else{
						alert(Resources.TRANSACTION_FAILED + result.error);
					}
				});
			});
		}
	};

	//initialize app
	$(document).ready(function () {
	    trans.init();
	});
})(jQuery);