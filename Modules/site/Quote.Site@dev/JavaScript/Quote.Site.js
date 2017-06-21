define('Quote.Site', [
    'underscore',
    'Utils',
    'Quote'
], function QuoteSite(
    _,
    Utils,
    Quote
) {
    'use strict';

    _(Quote).extend({
        MenuItems: {
            id: 'quotes',
            name: _('Completed Quotes').translate(),
            url: 'quotes',
            index: 1,
            permission: 'transactions.tranFind.1,transactions.tranEstimate.1'
        }
    });
});
