define('ItemDetails.View.SelectSingleOption', [
    'ItemDetails.View',
    'underscore'
], function ItemDetailsSelectSingleItemOption(
    View,
    _
) {
    'use strict';

    _.extend(View.prototype, {
        render: _.wrap(View.prototype.render, function itemDetailsWrap(fn) {
            var self = this;

            _.each(this.model.getPosibleOptions(), function eachPossibleOption(opt) {
                var option;
                var valueCount;
                var firstValue;

                if (opt.type === 'select' &&
                    opt.isMandatory === true &&
                    opt.isMatrixDimension === true &&
                    opt.values && opt.values.length > 0
                ) {
                    option = self.model.getOption(opt.cartOptionId);

                    if (!option) {
                        valueCount = (typeof opt.values[0].internalid !== 'undefined') ? 1 : 2;
                        if (opt.values.length === valueCount) {
                            firstValue = opt.values[valueCount - 1];
                            if (typeof firstValue === 'object' && firstValue.isAvailable === true) {
                                try {
                                    self.setOption(opt.cartOptionId, firstValue, false);
                                } catch (e) {
                                    // Clears all matrix options
                                    _.each(self.model.getPosibleOptions(), function eachPossibleOptions(innerOpts) {
                                        if (innerOpts.isMatrixDimension) {
                                            self.model.setOption(innerOpts.cartOptionId, null);
                                        }
                                    });
                                    // Sets the value once again
                                    self.model.setOption(opt.cartOptionId, firstValue);
                                }
                            }
                        }
                    }
                }
            });
            fn.apply(this, _.toArray(arguments).slice(1));
        })
    });
});

