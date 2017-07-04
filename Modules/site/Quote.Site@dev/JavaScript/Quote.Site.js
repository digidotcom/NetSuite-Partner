define('Quote.Site', [
    'underscore',
    'Utils',
    'Quote',
    'NavigationTabsDisplay'
], function QuoteSite(
    _,
    Utils,
    Quote,
    NavigationTabsDisplay
) {
    'use strict';

    _(Quote).extend({
        MenuItems: function MenuItems() {
            if (NavigationTabsDisplay.isVisible(NavigationTabsDisplay.tabs.QUOTES)) {
                return {
                    id: 'quotes',
                    name: _('Completed Quotes').translate(),
                    url: 'quotes',
                    index: 2,
                    permission: 'transactions.tranFind.1,transactions.tranEstimate.1'
                };
            }
        }
    });
});
