define('Form.Field.View', [
    'underscore',
    'Backbone',
    'jQuery',
    'Form.Field.Type',
    'Form.Lookup',
    'form_field.tpl',
    'form_field_text.tpl',
    'form_field_longtext.tpl',
    'form_field_list.tpl',
    'form_field_lookup.tpl'
], function FormFieldView(
    _,
    Backbone,
    jQuery,
    FormFieldType,
    FormLookup,
    formFieldTpl
) {
    'use strict';

    return Backbone.View.extend({

        events: {
            'change :input': 'notifyDependentFields',
            'click [data-lookup-trigger]': 'triggerLookup'
        },

        template: formFieldTpl,

        initialize: function initialize(options) {
            this.config = options.config;
            this.setupType();
            this.bindListenToRelatedAttribute();
            this.initializeLookup();
        },

        destroy: function destroy(softDestroy) {
            var result = this._destroy(softDestroy);
            this.unbindListenToRelatedAttribute();
            return result;
        },

        setupType: function parseType() {
            var type = new FormFieldType({
                model: this.model,
                config: this.config
            });
            this.type = type;
            this.template = type.getTemplate();
        },

        notifyDependentFields: function notifyDependentFields(e) {
            var attribute = this.model.get('attribute');
            var dependentFields = this.config.getDependentFields(attribute);
            if (dependentFields.length) {
                jQuery(window).trigger('formRelatedAttributeChange.' + attribute, [e.currentTarget, dependentFields]);
            }
        },

        bindListenToRelatedAttribute: function listenToRelatedAttribute() {
            var self = this;
            var relatedAttribute = this.model.get('relatedAttribute');
            var modelForm = this.config.model;
            if (relatedAttribute) {
                jQuery(window).on('formRelatedAttributeChange.' + relatedAttribute, function onFormRelatedAttributeChange(e, input) {
                    var value = jQuery(input).val();
                    modelForm.set(relatedAttribute, value, { silent: true });
                    self.isRerendering = true;
                    self.render();
                });
            }
        },

        unbindListenToRelatedAttribute: function listenToRelatedAttribute() {
            var relatedAttribute = this.model.get('relatedAttribute');
            if (relatedAttribute) {
                jQuery(window).off('formRelatedAttributeChange.' + relatedAttribute);
            }
        },

        initializeLookup: function initializeLookup() {
            this.lookup = new FormLookup({
                fieldView: this,
                application: this.config.application,
                config: this.config
            });
        },
        triggerLookup: function triggerLookup() {
            var displaySuffix = this.config.getFieldDisplaySuffix();
            var type = this.model.get('type');
            var attribute = this.model.get('attribute');
            var query;
            if (type === 'lookup') {
                query = this.$('[name="' + attribute + displaySuffix + '"]').val();
                this.lookup.search(query);
            }
        },
        handleLookupResponse: function handleLookupResponse(selectedModel) {
            console.log(selectedModel);
        },

        getContext: function getContext() {
            var model = this.model;
            var config = this.config;
            var type = this.type;
            var isInline = !!model.get('inline');
            var isNew = config.isNew();
            var isEdit = config.isEdit();
            var isView = config.isView();
            var context = {
                model: model,
                showContent: config.canAccess(),
                type: model.get('type'),
                attribute: model.get('attribute'),
                label: model.get('label'),
                isInline: isInline,
                isRequired: !!model.get('required'),
                tooltip: model.get('tooltip'),
                help: model.get('help'),
                isNew: isNew,
                isEdit: isEdit,
                isView: isView,
                isRerendering: !!this.isRerendering,
                showInline: isInline || isView
            };
            return _.extend(context, type.getContextAdditions());
        }

    });
});
