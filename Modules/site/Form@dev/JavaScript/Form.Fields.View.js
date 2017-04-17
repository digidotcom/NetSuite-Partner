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
            this.config = options.config;

            this.parseChildViewOptions(options);
            this.parseCollection(options);

            return fn.apply(this, Array.prototype.slice.call(arguments, 1));
        }),

        parseChildViewOptions: function parseChildViewOptions(options) {
            this.childViewOptions = _(this.childViewOptions || {}).extend(options.childViewOptions || {}, {
                config: this.config
            });
        },
        parseCollection: function parseFields(options) {
            this.collection = options.fields;
            options.collection = this.collection;
        }

    });
});
