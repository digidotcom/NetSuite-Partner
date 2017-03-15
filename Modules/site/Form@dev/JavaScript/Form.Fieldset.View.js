define('Form.Fieldset.View', [
    'underscore',
    'Backbone',
    'Backbone.CollectionView',
    'Form.Group.View',
    'form_fieldset.tpl',
    'form_fieldset_row.tpl'
], function FormFieldsetView(
    _,
    Backbone,
    BackboneCollectionView,
    FormGroupView,
    formFieldsetTpl,
    formFieldsetRowTpl
) {
    'use strict';

    return BackboneCollectionView.extend({

        childView: FormGroupView,

        template: formFieldsetTpl,
        rowTemplate: formFieldsetRowTpl,
        cellTemplate: null,

        childViewOptions: {},

        viewsPerRow: -1,

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
            this.collection = this.config.getData().groups;
            options.collection = this.collection;
        }

    });
});
