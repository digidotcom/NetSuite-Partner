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
                return CrudRecordModel.get(crudId, id);
            }
            return CrudRecordModel.list(crudId, CrudUtils.getListParameters());
        },

        post: function post() {
            var crudId = this.request.getParameter('id');
            var id;

            CrudUtils.validateCrudId(crudId);

            id = CrudRecordModel.create(crudId, this.data);
            this.sendContent(CrudRecordModel.get(crudId, id), { status: 201 });
        },

        put: function put() {
            var crudId = this.request.getParameter('id');
            var id = this.request.getParameter('internalid');

            CrudUtils.validateCrudId(crudId);
            CrudUtils.validateId(id);

            CrudRecordModel.update(crudId, id, this.data);
            return CrudRecordModel.get(crudId, id);
        }
    });
});
