'use strict';

module.exports = function (object, lineItem) {
    Object.defineProperty(object, 'preOrderUUID', {
        enumerable: true,
        value: 'preOrderUUID' in lineItem.custom ? lineItem.custom.preOrderUUID : null
    });
};
