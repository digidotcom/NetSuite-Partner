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
        list: function list(application, crudId, parentId, parentModel) {
            var collection;
            var view;

            if (CrudHelper.isPermissionAllowed(crudId, 'list')) {
                collection = new CrudRecordCollection(null, {
                    crudId: crudId,
                    parent: parentId
                });

                view = new CrudSubrecordListView({
                    application: application,
                    crudId: crudId,
                    parentModel: parentModel,
                    collection: collection
                });

                collection.on('reset', view.render, view);

                return view;
            }
            return null;
        }
    };
});
