define('NavigationTabsDisplay', [
    'SC.Configuration',
    'Publish',
    'NavigationTabsDisplay.Collection'
], function NavigationTabsDisplay(
    Configuration,
    Publish,
    NavigationTabsDisplayCollection
) {
    'use strict';

    return {
        tabs: {},
        getPublished: function getPublished() {
            return Publish.getAllPublishedObject('NavigationTabsDisplay');
        },
        getTabs: function getTabs() {
            var published = this.getPublished();
            this.tabs = (published && published.tabs) || this.tabs;
            return this.tabs;
        },
        getCollection: function get() {
            var values = Configuration.get('myAccount.navigationTabs', []);
            return new NavigationTabsDisplayCollection(values);
        },
        getCurrentRole: function getCurrentRole() {
            var published = this.getPublished();
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
