define('Documents', [
    'underscore',
    'Utils',
    'Documents.Router'
], function Documents(
    _,
    Utils,
    DocumentsRouter
) {
    'use strict';

    return {
        MenuItems: {
            id: 'documents',
            name: Utils.translate('Documents'),
            url: 'documents',
            index: 1,
            children: []
        },

        mountToApp: function mountToApp(application) {
            return new DocumentsRouter(application);
        }
    };
});
