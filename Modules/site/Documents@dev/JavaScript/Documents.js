define('Documents', [
    'underscore',
    'Utils',
    'Documents.Router',
    'NavigationTabsDisplay'
], function Documents(
    _,
    Utils,
    DocumentsRouter,
    NavigationTabsDisplay
) {
    'use strict';

    return {
        MenuItems: function MenuItems() {
            if (NavigationTabsDisplay.isVisible(NavigationTabsDisplay.tabs.DOCUMENTS)) {
                return {
                    id: 'documents',
                    name: Utils.translate('Marketing Materials'),
                    url: 'documents',
                    index: 3,
                    children: []
                };
            }
        },

        mountToApp: function mountToApp(application) {
            return new DocumentsRouter(application);
        }
    };
});
