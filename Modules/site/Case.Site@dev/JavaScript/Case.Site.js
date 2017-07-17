define('Case.Site', [
    'underscore',
    'Case',
    'NavigationTabsDisplay',
    'Case.Create.View.Site'
], function CaseSite(
    _,
    Case,
    NavigationTabsDisplay
) {
    'use strict';

    _(Case).extend({
        MenuItems: _(Case.MenuItems).wrap(function MenuItemsWrapper(fn) {
            if (NavigationTabsDisplay.isVisible(NavigationTabsDisplay.getTabs().CASES)) {
                return fn.apply(this, Array.prototype.slice.call(arguments, 1));
            }
        })
    });
});
