define('NavigationTabsDisplay', [
    'SC.Configuration',
    'NavigationTabsDisplay.Collection'
], function NavigationTabsDisplay(
    Configuration,
    NavigationTabsDisplayCollection
) {
    'use strict';

    var published = SC.getPublishedObject('NavigationTabsDisplay');

    return {
        tabs: (published && published.tabs) || {},
        getCollection: function get() {
            var values = Configuration.get('myAccount.navigationTabs', []);
            return new NavigationTabsDisplayCollection(values);
        },
        getCurrentRole: function getCurrentRole() {
            if (published && published.role && published.role.scriptId) {
                return published.role.scriptId;
            }
            return null;
        },
        isVisible: function isVisible(tab) {
            var collection = this.getCollection();
            var role = this.getCurrentRole();
            if (role) {
                return !!collection.findWhere({ role: role, navigationTab: tab, display: true });
            }
            return false;
        }
    };
});
