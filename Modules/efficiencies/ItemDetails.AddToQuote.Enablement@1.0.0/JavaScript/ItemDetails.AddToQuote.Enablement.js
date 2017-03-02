/*
 © 2016 NetSuite Inc.
 User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
 provided, however, if you are an authorized user with a NetSuite account or log-in, you
 may use this code subject to the terms that govern your access and use.
 */

define('ItemDetails.AddToQuote.Enablement', [
    'ItemDetails.View',
    'underscore'
], function (
    ItemDetailsView,
    _
) {
    'use strict';

    return  {
        mountToApp: function mountToApp (application) {
            var pdpToQuoteConfig = SC.CONFIGURATION &&
                                    SC.CONFIGURATION.commerceSuiteSolution &&
                                    SC.CONFIGURATION.commerceSuiteSolution.qs &&
                                    SC.CONFIGURATION.commerceSuiteSolution.qs.pdpAddToQuote;

            if (! pdpToQuoteConfig.enabled ) {
                application.getLayout().on('beforeRender', function() {
                    _.extend(ItemDetailsView.prototype.childViews, {
                        'ItemDetails.AddToQuote': function ItemDetailsAddToQuoteChildView() {}
                    });
                });
            }
        }
    };
});