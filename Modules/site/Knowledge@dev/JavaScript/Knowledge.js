define('Knowledge', [
    'underscore',
    'Utils',
    'Knowledge.Router',
    'NavigationTabsDisplay'
], function Knowledge(
    _,
    Utils,
    KnowledgeRouter,
    NavigationTabsDisplay
) {
    'use strict';

    return {
        MenuItems: function MenuItems() {
            if (NavigationTabsDisplay.isVisible(NavigationTabsDisplay.tabs.KNOWLEDGE)) {
                return {
                    id: 'knowledge',
                    name: Utils.translate('Knowledge'),
                    url: 'knowledge',
                    index: 3
                };
            }
        },

        mountToApp: function mountToApp(application) {
            return new KnowledgeRouter(application);
        }

    };
});
