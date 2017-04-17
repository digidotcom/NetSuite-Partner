define('Form.Body.View', [
    'underscore',
    'Backbone',
    'Backbone.CollectionView',
    'Form.Group.View',
    'form_body.tpl',
    'form_body_row.tpl'
], function FormBodyView(
    _,
    Backbone,
    BackboneCollectionView,
    FormGroupView,
    formBodyTpl,
    formBodyRowTpl
) {
    'use strict';

    return BackboneCollectionView.extend({

        childView: FormGroupView,

        template: formBodyTpl,
        rowTemplate: formBodyRowTpl,
        cellTemplate: null,

        childViewOptions: {},

        viewsPerRow: -1,

        initialize: _.wrap(BackboneCollectionView.prototype.initialize, function initialize(fn, options) {
            this.config = options.config;

            this.parseChildViewOptions(options);
            this.parseCollection(options);
            this.parseAdditionalContext(options);

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
        },
        parseAdditionalContext: function parseAdditionalContext(options) {
            this.context = _(this.context || {}).extend({
                showRequiredMessage: !this.config.isView() && this.config.hasRequiredFields()
            });
            options.context = this.context;
        }

    });
});
