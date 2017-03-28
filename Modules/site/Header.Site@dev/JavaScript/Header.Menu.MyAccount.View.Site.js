define('Header.Menu.MyAccount.View.Site', [
    'underscore',
    'Header.Menu.MyAccount.View',
    'Registration.Helper'
], function HeaderMenuMyAccountViewSite(
    _,
    HeaderMenuMyAccountView,
    RegistrationHelper
) {
    'use strict';

    HeaderMenuMyAccountView.prototype.installPlugin('postContext', {
        name: 'RegistrationMenuItem',
        execute: function execute(context) {
            var menuItems = RegistrationHelper.getMenuItems();
            var registrationsMenu = _({}).extend(menuItems, {
                hasChildren: menuItems && menuItems.children && (menuItems.children.length > 0)
            });
            _(context).extend({
                registrationsMenu: registrationsMenu
            });
        }
    });
});
