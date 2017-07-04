define('Case.Site', [
    'underscore',
    'Case',
    'NavigationTabsDisplay'
], function QuoteSite(
    _,
    Case,
    NavigationTabsDisplay
) {
    'use strict';

    _(Case).extend({
        MenuItems: _(Case.MenuItems).wrap(function MenuItemsWrapper(fn) {
            if (NavigationTabsDisplay.isVisible(NavigationTabsDisplay.tabs.CASES)) {
                return fn.apply(this, Array.prototype.slice.call(arguments, 1));
            }
        })
    });
});
