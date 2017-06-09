define('CRUD.Lookup', [
    'jQuery',
    'CRUD.Lookup.Collection'
], function CrudLookupModel(
    jQuery,
    CrudLookupCollection
) {
    'use strict';

    return {
        getPromiseCallback: function getPromiseCallback(crudId) {
            return function lookupCallback(data) {
                var deferred = jQuery.Deferred();
                var collection = new CrudLookupCollection(null, {
                    crudId: crudId
                });
                collection.fetch({
                    data: {
                        q: data.query,
                        field: data.field
                    }
                }).done(function doneFn() {
                    deferred.resolveWith(collection, [collection]);
                }).fail(function failFn() {
                    deferred.rejectWith(collection, [collection]);
                });
                return deferred.promise();
            };
        }
    };
});
