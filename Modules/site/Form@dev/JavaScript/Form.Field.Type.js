define('Form.Field.Type', [
    'underscore',
    'SC.Configuration',
    'Form.Field.Lists',
    'form_field.tpl',
    'form_field_hidden.tpl',
    'form_field_text.tpl',
    'form_field_longtext.tpl',
    'form_field_list.tpl',
    'form_field_lookup.tpl'
], function FormFieldTypeModule(
    _,
    Configuration,
    FormFieldLists,
    formFieldTpl,
    formFieldHiddenTpl,
    formFieldTextTpl,
    formFieldLongTextTpl,
    formFieldListTpl,
    formFieldLookupTpl
) {
    'use strict';

    function FormFieldType(options) {
        this.model = options.model;
        this.config = options.config;
        this.initialize();
    }

    _(FormFieldType.prototype).extend({

        initialize: function initialize() {
            this.type = this.model.get('type');
            this.template = this.getTemplate();
        },

        /* eslint-disable complexity */
        getTemplate: function parseType() {
            switch (this.type) {
            case 'hidden':
                return formFieldHiddenTpl;
            case 'text':
            case 'email':
            case 'phone':
            case 'number':
            case 'currency':
            case 'url':
            case 'date':
            case 'datetime':
                return formFieldTextTpl;
            case 'longtext':
                return formFieldLongTextTpl;
            case 'list':
                return formFieldListTpl;
            case 'lookup':
                return formFieldLookupTpl;
            default:
                return formFieldTpl;
            }
        },
        /* eslint-enable complexity */

        getInputType: function getInputType() {
            switch (this.type) {
            case 'phone':
            case 'email':
                return 'text';
            case 'currency':
                return 'number';
            default:
                return this.type;
            }
        },

        getListOptions: function getListOptions() {
            var states;
            var modelField = this.model;
            var modelForm = this.config.model;
            var relatedAttribute = modelField.get('relatedAttribute');
            var relatedAttributeValue = relatedAttribute ? modelForm.get(relatedAttribute) : null;
            var lists = this.config.getLists();
            var list = modelField.get('list');
            this.showAsTextField = false;
            if (_.isFunction(list)) {
                return list(relatedAttributeValue, this);
            } else if (_.isObject(list)) {
                return _.values(list);
            } else if (_.isArray(list)) {
                return list;
            } else if (_.isString(list)) {
                if (list === 'countries') {
                    return FormFieldLists.getCountries();
                } else if (list === 'states') {
                    states = FormFieldLists.getStates(relatedAttributeValue);
                    this.showAsTextField = (states.length === 0);
                    return states;
                } else if (list in lists) {
                    return lists[list];
                }
            }
            return [];
        },

        getContextAdditions: function getContextAdditions() {
            var modelForm = this.config.model;
            var modelField = this.model;
            var displaySuffix = this.config.getFieldDisplaySuffix();
            var attribute = modelField.get('attribute');
            var fieldValue = modelForm.get(attribute);
            var fieldValueDisplay = modelForm.get(attribute + displaySuffix);
            var isInline = !!modelField.get('inline');
            var context = {
                inputType: this.getInputType(),
                isInlineEmpty: isInline && !fieldValue
            };
            if (this.type === 'list' || this.type === 'lookup') {
                context.nameFieldSuffix = displaySuffix;
                context.selectedValue = fieldValue;
                context.selectedName = fieldValueDisplay;
                if (this.type === 'list') {
                    context.options = this.getListOptions();
                    context.showAsTextField = this.showAsTextField; // important to be after this.getListOptions()
                    context.list = modelField.get('list');
                    context.relatedAttribute = modelField.get('relatedAttribute');
                    context.hideDefaultOption = !!modelField.get('nodefault');
                }
            } else {
                context.value = fieldValue;
                if (this.type === 'currency') {
                    context.isCurrency = true;
                }
            }
            return context;
        }

    });

    FormFieldType.isComplexType = function isComplexType(type) {
        switch (type) {
        case 'list':
        case 'lookup':
            return true;
        default:
            return false;
        }
    };

    return FormFieldType;
});
