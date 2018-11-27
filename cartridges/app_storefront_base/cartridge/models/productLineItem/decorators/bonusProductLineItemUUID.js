'use strict';

module.exports = function (object, lineItem) {
    Object.defineProperty(object, 'bonusProductLineItemUUID', {
        enumerable: true,
        value: 'bonusProductLineItemUUID' in  lineItem.custom ? lineItem.custom.bonusProductLineItemUUID : null
    });
};
