define('Registration.Configuration', [
    'Utils'
], function RegistrationConfiguration(
    Utils
) {
    'use strict';

    return {
        crudId: 'registration',

        getMenuItems: function getMenuItems(/* config */) {
            var permissions = this.getCrudPermissions();
            var menuItems = {
                id: 'registrations',
                name: Utils.translate('Registrations'),
                url: '',
                index: 0,
                children: []
            };
            if (permissions.list) {
                menuItems.url = this.getListUrl(true);
                menuItems.children.push({
                    parent: 'registrations',
                    id: 'registrations_all',
                    name: Utils.translate('Registrations'),
                    url: this.getListUrl(true),
                    index: 1
                });
            }
            if (permissions.create) {
                menuItems.children.push({
                    parent: 'registrations',
                    id: 'registrations_new',
                    name: Utils.translate('New Registration'),
                    url: this.getNewUrl(true),
                    qindex: 2
                });
            }
            return menuItems;
        }
    };
});
