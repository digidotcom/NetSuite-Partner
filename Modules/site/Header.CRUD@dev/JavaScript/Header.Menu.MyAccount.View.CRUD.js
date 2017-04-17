define('Header.Menu.MyAccount.View.CRUD', [
    'underscore',
    'Header.Menu.MyAccount.View',
    'CRUD.Helper'
], function HeaderMenuMyAccountViewCrud(
    _,
    HeaderMenuMyAccountView,
    CrudHelper
) {
    'use strict';

    HeaderMenuMyAccountView.prototype.installPlugin('postContext', {
        name: 'CrudMenuItems',
        execute: function execute(context) {
            var menuItems = CrudHelper.getMenuItemsAll();
            var crudMenus = [];
            _(menuItems).each(function eachCrudMenu(menuItem) {
                var crudMenu = _({}).extend(menuItem, {
                    hasChildren: menuItem && menuItem.children && (menuItem.children.length > 0)
                });
                crudMenus.push(crudMenu);
            });
            _(context).extend({
                crudMenus: crudMenus
            });
        }
    });
});
