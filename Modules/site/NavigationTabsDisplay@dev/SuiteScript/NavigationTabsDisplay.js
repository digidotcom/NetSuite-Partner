define('NavigationTabsDisplay', [
    'underscore',
    'Configuration',
    'Publish',
    'NavigationTabsDisplay.Configuration'
], function NavigationTabsDisplay(
    _,
    Configuration,
    Publish,
    NavigationTabsDisplayConfiguration
) {
    'use strict';

    Publish.sessionPublish({
        key: 'NavigationTabsDisplay',
        model: 'NavigationTabsDisplay.Configuration',
        call: 'getForBootstrapping'
    });

    return {
        tabs: NavigationTabsDisplayConfiguration.tabs,
        getConfig: function getConfig() {
            return NavigationTabsDisplayConfiguration;
        },
        isVisible: function isTabVisible(tab) {
            var values = Configuration.get('myAccount.navigationTabs', []);
            var role = this.getConfig().role.scriptId;
            return !!_(values).findWhere({ role: role, navigationTab: tab, display: true });
        }
    };
});
