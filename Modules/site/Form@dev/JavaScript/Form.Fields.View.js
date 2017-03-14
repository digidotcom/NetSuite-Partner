define('Form.Fields.View', [
    'underscore',
    'Backbone',
    'Backbone.CollectionView',
    'Form.Field.Collection',
    'Form.Field.View',
    'form_fields.tpl',
    'form_fields_row.tpl',
    'form_fields_cell.tpl'
], function FormFieldsView(
    _,
    Backbone,
    BackboneCollectionView,
    FormFieldCollection,
    FormFieldView,
    formFieldsTpl,
    formFieldsRowTpl,
    formFieldsCellTpl
) {
    'use strict';

    return BackboneCollectionView.extend({

        childView: FormFieldView,

        template: formFieldsTpl,
        rowTemplate: formFieldsRowTpl,
        cellTemplate: formFieldsCellTpl,

        childViewOptions: {},

        viewsPerRow: 2,
        rowsCount: 12,

        initialize: _.wrap(BackboneCollectionView.prototype.initialize, function initialize(fn, options) {
            this.fields = options.fields;
            this.parseFields();

            options.collection = this.collection;
            return fn.apply(this, Array.prototype.slice.call(arguments, 1));
        }),

        parseFields: function parseFields() {
            this.collection = this.fields;
        }

    });
});
