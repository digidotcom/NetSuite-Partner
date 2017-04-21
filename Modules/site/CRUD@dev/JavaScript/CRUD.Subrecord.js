define('CRUD.Subrecord', [
    'CRUD.Helper',
    'CRUD.Record.Collection',
    'CRUD.Subrecord.List.View'
], function CrudRouter(
    CrudHelper,
    CrudRecordCollection,
    CrudSubrecordListView
) {
    'use strict';


    return {
        list: function list(application, crudId) {
            var collection;
            var view;

            if (CrudHelper.isPermissionAllowed(crudId, 'list')) {
                collection = new CrudRecordCollection(null, {
                    crudId: crudId
                });

                view = new CrudSubrecordListView({
                    application: application,
                    crudId: crudId,
                    collection: collection
                });

                collection.on('reset', view.render, view);

                return view;
            }
            return null;
        }
    };
});
