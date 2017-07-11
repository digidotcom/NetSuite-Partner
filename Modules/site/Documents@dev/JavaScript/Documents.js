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
            if (NavigationTabsDisplay.isVisible(NavigationTabsDisplay.getTabs().DOCUMENTS)) {
                return {
                    id: 'marketing',
                    name: Utils.translate('Marketing Materials'),
                    url: '',
                    index: 3,
                    children: [
                        {
                            id: 'documents',
                            name: Utils.translate('Marketing Documents'),
                            url: 'documents',
                            index: 1
                        },
                        {
                            id: 'pricelists',
                            name: Utils.translate('Price Lists'),
                            url: 'pricelists',
                            index: 2
                        }
                    ]
                };
            }
        },

        mountToApp: function mountToApp(application) {
            return new DocumentsRouter(application);
        }
    };
});
