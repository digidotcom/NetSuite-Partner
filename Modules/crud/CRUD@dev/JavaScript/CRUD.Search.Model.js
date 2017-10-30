define('CRUD.Search.Model', [
    'underscore',
    'Backbone',
    'Utils',
    'CRUD.Helper'
], function CrudSearchModel(
    _,
    Backbone,
    Utils,
    CrudHelper
) {
    'use strict';

    return Backbone.Model.extend({

        idAttribute: '_id',

        initialize: function initialize() {
            this.crudId = this.get('crudId');
            this.parseAttributes();
        },

        parseAttributes: function parseAttributes() {
            var result = this.get('result');
            if (result) {
                this.set({
                    _id: this.parseId(result),
                    _url: this.parseUrl(result),
                    _name: this.parseName(result),
                    _record: this.parseRecordName()
                });
            }
        },

        parseId: function parseId(data) {
            return data.internalid;
        },
        parseUrl: function parseUrl(data) {
            return CrudHelper.getViewUrl(this.crudId, data.internalid);
        },
        parseName: function parseName(data) {
            return data.name;
        },
        parseRecordName: function parseRecordName() {
            var names = CrudHelper.getNames(this.crudId);
            return names && names.singular;
        }

    });
});
