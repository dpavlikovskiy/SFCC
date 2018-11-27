'use strict';

(function ($) {
    var trans = {
        init: function () {
            var refundHistoryString = $('label#refundHistory').get(0).innerHTML,
                refundedAmount = 0,
                total = parseFloat($('input[name=total]').val());

            if (refundHistoryString != '') { var refundHistory = JSON.parse(refundHistoryString); }
            if (refundHistory) {
                $.each(refundHistory, function (index, refundAmount) {
                    refundedAmount += parseFloat(refundAmount.value);
                });
            }
            var maxRefundAmount = total - refundedAmount;
            $('[name=amount]').val(maxRefundAmount.toFixed(2));
            $('[name=amount]').attr('data-refundhistorytotal', refundedAmount.toFixed(2));


            if ($('.openpay-module .operations-holder').length) {
                this.transOperationsEvents();
            }
        },
        transOperationsEvents: function () {
            $('.transaction-actions').on('click', function () {
                $('.operations-holder').toggle();
            });
            $('.operations-holder button').on('click', function () {
                var button = $(this),
                    buttonLabel = button.text(),
                    orderno = $('input[name=orderno]').val(),
                    planID = $('input[name=planID]').val(),
                    amount = parseFloat($('input[name=amount]').val()),
                    total = parseFloat($('input[name=total]').val()),
                    refundHistoryTotal = parseFloat($('input[name=amount]').data('refundhistorytotal')),
                    fullRefund = false,
                    url,
                    postData;

                if (amount <= 0.0 || amount > total) {
                    $('.operations-holder .error').text(Resources.INVALID_REFUND_AMOUNT);
                    return false;
                }
                if (refundHistoryTotal) {
                    if ((refundHistoryTotal + amount) > total) {
                        var maxRefundAmount = total - refundHistoryTotal;
                        $('.operations-holder .error').text(Resources.MAXIMUM_REFUND_AMOUNT + maxRefundAmount.toFixed(2));
                        return false;
                    }
                }
                if ((refundHistoryTotal + amount) === total) {
                    fullRefund = true;
                }

                $('.operations-holder .error').text('');
                url = Urls.operationActions;
                postData = {
                    orderno: orderno,
                    planID: planID,
                    amount: amount,
                    fullRefund: fullRefund
                };

                button.prop('disabled', true);
                button.text(Resources.TRANSACTION_PROCESSING);

                $.post(url, postData, function (data, status) {
                    var result = data ? JSON.parse(data) : {};

                    button.prop('disabled', false);
                    button.text(buttonLabel);

                    if (result && result.success) {
                        alert(Resources.TRANSACTION_SUCCESS);
                        window.location.reload();
                    }					else {
                        alert(Resources.TRANSACTION_FAILED + result.error);
                    }
                });
            });
        }
    };

	// initialize app
    $(document).ready(function () {
	    trans.init();
    });
}(jQuery));
