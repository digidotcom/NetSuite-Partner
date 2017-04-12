define('CRUD.Status.View', [
    'underscore',
    'Backbone',
    'Utils',
    'CRUD.Helper',
    'crud_status.tpl'
], function CrudStatusView(
    _,
    Backbone,
    Utils,
    CrudHelper,
    crudStatusTpl
) {
    'use strict';

    return Backbone.View.extend({

        template: crudStatusTpl,

        initialize: function initialize(options) {
            this.collection = options.collection;
            this.crudId = options.crudId;
            this.active = parseInt(options.active, 10) || null;
        },

        getStatusContext: function getStatusContext(model, active) {
            var crudId = this.crudId;
            var params = {};
            var id = null;
            var name = CrudHelper.getStatusAllLabel();
            var isActive = !active;
            if (model) {
                id = parseInt(model.get('internalid'), 10);
                name = model.get('name');
                params[CrudHelper.getStatusFilterName(crudId)] = id;
                isActive = id === active;
            }
            return {
                name: name,
                value: id,
                url: Utils.addParamsToUrl(CrudHelper.getListUrl(crudId), params),
                isActive: isActive
            };
        },

        getContext: function getContext() {
            var self = this;
            var collection = this.collection;
            var active = this.active;
            var statuses = [
                self.getStatusContext(null, active)
            ];
            if (collection.length) {
                collection.each(function eachCollection(status) {
                    statuses.push(self.getStatusContext(status, active));
                });
            }
            return {
                statuses: statuses
            };
        }
    });
});
