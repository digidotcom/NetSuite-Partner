define('CRUD.Helper.List', [
    'underscore',
    'Utils',
    'CRUD.Configuration'
], function CrudHelperList(
    _,
    Utils,
    CrudConfiguration
) {
    'use strict';

    return {
        lists: {},
        getExcludedLists: function getExcludedLists() {
            return ['countries', 'states'];
        },
        getListServiceUrl: function getListServiceUrl(crudId, listIds, absolute) {
            var url = CrudConfiguration.get(crudId).listServiceUrl;
            url += (url.indexOf('?') >= 0) ? '&' : '?';
            url += 'ids=' + (listIds ? listIds.join(',') : '');
            return absolute ? Utils.getAbsoluteUrl(url) : url;
        },
        isFieldTypeList: function isFieldList(field) {
            var list = field.list;
            return field.type === 'list' &&
                   list && (typeof list === 'string') &&
                   (_.indexOf(this.getExcludedLists(), list) < 0);
        },
        getFieldListNames: function getFieldListNames(crudId) {
            var self = this;
            var fields = this.getFields(crudId);
            var lists = [];
            _(fields).each(function eachFields(field) {
                if (self.isFieldTypeList(field)) {
                    lists.push(field.list);
                }
            });
            return _.unique(lists).sort();
        },
        addList: function addListToCache(model) {
            this.lists[model.get('name')] = model;
        },
        addLists: function addListsToCache(collection) {
            var self = this;
            collection.each(function eachListsCollection(model) {
                self.addList(model);
            });
        },
        getList: function getList(name) {
            return this.lists[name] || null;
        },
        /* page can be 'view', 'edit' or 'new' */
        hasListsInPage: function hasListsInPage(crudId, page) {
            return page !== 'view' && this.getFieldListNames(crudId).length > 0;
        }
    };
});
