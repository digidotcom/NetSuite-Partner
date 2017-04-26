define('CRUD.Helper.Menus', [
    'underscore',
    'Utils',
    'CRUD.Configuration'
], function CrudHelperMenus(
    _,
    Utils,
    CrudConfiguration
) {
    'use strict';

    return {
        getBreadcrumbBase: function getBreadcrumbParts(crudId, id, parentId) {
            var parentCrudId = this.getParentCrudId(crudId);
            var names = this.getNames(crudId);
            var breadcrumb = [];
            var listUrl = this.getListUrl(crudId, parentId);
            if (parentCrudId) {
                breadcrumb = _.union(breadcrumb, this.getBreadcrumbBase(parentCrudId, parentId));
                listUrl = this.getParentUrlWithSubrecord(crudId, parentId);
            }
            breadcrumb.push({
                text: Utils.translate(names.plural),
                href: listUrl
            });
            if (id) {
                breadcrumb.push({
                    text: Utils.translate('#$(0)', id),
                    href: this.getViewUrl(crudId, id, parentId)
                });
            }
            return breadcrumb;
        },
        getMenuItems: function getMenuItems(crudId) {
            var names = this.getNames(crudId);
            var permissions = this.getPermissions(crudId);
            var baseKey = this.getBaseKey(crudId);
            var menuItems = {
                id: baseKey,
                name: Utils.translate(names.plural),
                url: '',
                index: 0,
                children: []
            };
            if (permissions.list) {
                menuItems.url = this.getListUrl(crudId);
                menuItems.children.push({
                    parent: baseKey,
                    id: baseKey + '_all',
                    name: Utils.translate(names.plural),
                    url: this.getListUrl(crudId),
                    index: 1
                });
            }
            if (permissions.create) {
                menuItems.children.push({
                    parent: baseKey,
                    id: baseKey + '_new',
                    name: Utils.translate('New $(0)', names.singular),
                    url: this.getNewUrl(crudId),
                    qindex: 2
                });
            }
            return menuItems;
        },
        getMenuItemsAll: function getMenuItemsAll() {
            var self = this;
            var crudIds = CrudConfiguration.getCrudIds();
            var menuItems = [];
            _(crudIds).each(function mapCrudIds(crudId) {
                if (self.isCrudType(crudId)) {
                    menuItems.push(self.getMenuItems(crudId));
                }
            });
            return menuItems;
        }
    };
});
