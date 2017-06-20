define('OrderHistory.Site', [
    'underscore',
    'OrderHistory'
], function OrderHistorySite(
    _,
    OrderHistory
) {
    'use strict';

    _(OrderHistory).extend({
        MenuItems: _(OrderHistory.MenuItems).wrap(function MenuItemsWrapFn(fn) {
            var menuItems = fn.apply(this, Array.prototype.slice.call(arguments, 1));
            var purchasesItem;

            menuItems.name = _('Completed Quotes').translate();
            purchasesItem = _(menuItems.children).findWhere({ id: 'purchases' });
            if (purchasesItem) {
                purchasesItem.name = _('Completed Quotes History').translate();
            }

            return menuItems;
        })
    });
});
