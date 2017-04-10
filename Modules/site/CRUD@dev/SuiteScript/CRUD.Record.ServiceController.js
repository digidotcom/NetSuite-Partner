define('CRUD.Record.ServiceController', [
    'underscore',
    'ServiceController',
    'CRUD.Utils',
    'CRUD.Record.Model'
], function CrudRecordServiceController(
    _,
    ServiceController,
    CrudUtils,
    CrudRecordModel
) {
    'use strict';

    return ServiceController.extend({
        name: 'CRUD.Record.ServiceController',

        options: {
            common: {
                requireSecure: true,
                requireLogin: true
            }
        },

        get: function get() {
            var crudId = this.request.getParameter('id');
            var id = this.request.getParameter('internalid');

            CrudUtils.validateCrudId(crudId);

            if (id) {
                if (CrudUtils.isAllowed(crudId, 'read')) {
                    return CrudRecordModel.get(crudId, id);
                }
                return null;
            }
            if (CrudUtils.isAllowed(crudId, 'list')) {
                return CrudRecordModel.list(crudId, CrudUtils.getListParameters(crudId, this.request));
            }
            return null;
        },

        post: function post() {
            var crudId = this.request.getParameter('id');
            var id;
            var result;

            CrudUtils.validateCrudId(crudId);

            if (CrudUtils.isAllowed(crudId, 'create')) {
                id = CrudRecordModel.create(crudId, this.data);
                result = { internalid: id };
                if (CrudUtils.isAllowed(crudId, 'read')) {
                    result = CrudRecordModel.get(crudId, id);
                }
                this.sendContent(result, { status: 201 });
            }
        },

        put: function put() {
            var crudId = this.request.getParameter('id');
            var id = this.request.getParameter('internalid');

            CrudUtils.validateCrudId(crudId);
            CrudUtils.validateId(id);

            if (CrudUtils.isAllowed(crudId, 'update')) {
                CrudRecordModel.update(crudId, id, this.data);
                return CrudRecordModel.get(crudId, id);
            }
            return null;
        },

        'delete': function deleteFn() {
            var crudId = this.request.getParameter('id');
            var id = this.request.getParameter('internalid');

            CrudUtils.validateCrudId(crudId);
            CrudUtils.validateId(id);

            if (CrudUtils.isAllowed(crudId, 'delete')) {
                CrudRecordModel.delete(crudId, id);
                return { internalid: id };
            }
            return null;
        }
    });
});
