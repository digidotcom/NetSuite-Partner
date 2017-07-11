define('Header.Menu.MyAccount.View.Site', [
    'underscore',
    'Header.Menu.MyAccount.View',
    'CRUD.Helper',
    'NavigationTabsDisplay'
], function HeaderMenuMyAccountViewSite(
    _,
    HeaderMenuMyAccountView,
    CrudHelper,
    NavigationTabsDisplay
) {
    'use strict';

    HeaderMenuMyAccountView.prototype.installPlugin('postContext', {
        name: 'CrudMenuItems',
        execute: function execute(context) {
            var tabs = NavigationTabsDisplay.getTabs();
            var menuItems = CrudHelper.getMenuItemsAll();
            var crudMenus = [];
            _(menuItems).each(function eachCrudMenu(menuItem) {
                var crudMenu = _({}).extend(menuItem, {
                    hasChildren: menuItem && menuItem.children && (menuItem.children.length > 0)
                });
                crudMenus.push(crudMenu);
            });
            crudMenus.sort(function sortCrudMenus(a, b) {
                if (a.index < b.index) {
                    return -1;
                } else if (a.index === b.index) {
                    return 0;
                }
                return 1;
            });
            _(context).extend({
                hasCrudMenus: crudMenus.length,
                crudMenus: crudMenus,
                showQuotes: NavigationTabsDisplay.isVisible(tabs.QUOTES),
                showDocuments: NavigationTabsDisplay.isVisible(tabs.DOCUMENTS),
                showKnowledge: NavigationTabsDisplay.isVisible(tabs.KNOWLEDGE),
                showSettings: NavigationTabsDisplay.isVisible(tabs.SETTINGS),
                isCaseModuleEnabled: context.isCaseModuleEnabled && NavigationTabsDisplay.isVisible(tabs.CASES)
            });
        }
    });
});
