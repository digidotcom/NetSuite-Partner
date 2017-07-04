define('Settings.MenuItemsDisplay', [
    'underscore',
    'Utils',
    'MyAccount.Profile',
    'Address',
    'CreditCard',
    'NavigationTabsDisplay'
], function SettingsMenuItemsDisplay(
    _,
    Utils,
    MyAccountProfile,
    Address,
    CreditCard,
    NavigationTabsDisplay
) {
    'use strict';

    var displaySettingsMenu = NavigationTabsDisplay.isVisible(NavigationTabsDisplay.tabs.SETTINGS);

    function setMenuItemsWrapper(Module) {
        var originalMenuItems = Module.MenuItems;
        _(Module).extend({
            MenuItems: function MenuItems() {
                if (displaySettingsMenu) {
                    if (originalMenuItems && originalMenuItems.length && originalMenuItems.length === 1) {
                        return originalMenuItems[0];
                    }
                    return originalMenuItems;
                }
            }
        });
    }

    setMenuItemsWrapper(MyAccountProfile);
    setMenuItemsWrapper(Address);
    setMenuItemsWrapper(CreditCard);
});
