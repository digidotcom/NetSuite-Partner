define('Form.Field.Type', [
    'underscore',
    'SC.Configuration',
    'form_field.tpl',
    'form_field_hidden.tpl',
    'form_field_text.tpl',
    'form_field_longtext.tpl',
    'form_field_list.tpl',
    'form_field_lookup.tpl'
], function FormFieldTypeModule(
    _,
    Configuration,
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

        getValidatedList: function getValidatedList(list, relatedAttributeValue, listsAvailable) {
            if (_.isFunction(list)) {
                return this.getValidatedList(list(relatedAttributeValue, this));
            } else if (_.isObject(list)) {
                return _.values(list);
            } else if (_.isArray(list)) {
                return list;
            } else if (_.isString(list) && (list in listsAvailable)) {
                return this.getValidatedList(listsAvailable[list], relatedAttributeValue, listsAvailable);
            }
            return [];
        },

        getListOptions: function getListOptions() {
            var modelField = this.model;
            var modelForm = this.config.model;
            var relatedAttribute = modelField.get('relatedAttribute');
            var relatedAttributeValue = relatedAttribute ? modelForm.get(relatedAttribute) : null;
            var listsAvailable = this.config.getLists();
            var list = modelField.get('list');
            var validatedList = this.getValidatedList(list, relatedAttributeValue, listsAvailable);
            this.isDisabled = (validatedList.length === 0);
            return validatedList;
        },

        getContextAdditions: function getContextAdditions() {
            var modelForm = this.config.model;
            var modelField = this.model;
            var displaySuffix = this.config.getFieldDisplaySuffix();
            var attribute = modelField.get('attribute');
            var attributeDisplay = attribute + displaySuffix;
            var fieldValue = modelForm.get(attribute);
            var fieldValueDisplay = modelForm.get(attributeDisplay);
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
                    context.isDisabled = !!this.isDisabled; // important to be after this.getListOptions()
                    if (this.isDisabled) {
                        modelForm.set(attribute, '-1');
                        modelForm.set(attributeDisplay, '---');
                    }
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
