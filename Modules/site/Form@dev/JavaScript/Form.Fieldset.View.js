define('Form.Fieldset.View', [
    'underscore',
    'Backbone',
    'Backbone.CollectionView',
    'Form.Group.Collection',
    'Form.Group.View',
    'Form.Field.Collection',
    'form_fieldset.tpl',
    'form_fieldset_row.tpl'
], function FormFieldsetView(
    _,
    Backbone,
    BackboneCollectionView,
    FormGroupCollection,
    FormGroupView,
    FormFieldCollection,
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
            this.groups = options.groups;
            this.parseGroups();

            options.collection = this.collection;
            return fn.apply(this, Array.prototype.slice.call(arguments, 1));
        }),

        parseGroups: function parseFields() {
            var groups = this.groups;
            _(groups).each(function eachFn(group) {
                group.fields = new FormFieldCollection(_(group.fields).values());
            });
            this.collection = new FormGroupCollection(groups);
        }

    });
});
