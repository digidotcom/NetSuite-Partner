define('CRUD.Lookup.Model', [
    'underscore',
    'SC.Model',
    'CRUD.Configuration'
], function CrudLookupModel(
    _,
    SCModel,
    CrudConfiguration
) {
    'use strict';

    return SCModel.extend({
        name: 'CRUD.Lookup',

        get: function get(crudId, data) {
            var config = CrudConfiguration.getForRecord(crudId);
            var fieldKey = data.field;
            var query = data.query;
            var fieldConfig = CrudConfiguration.getFieldConfigForRecord(config, fieldKey);
            var record;
            var field;
            var options;
            var optionsValues = [];

            if (fieldConfig) {
                record = nlapiCreateRecord(config.record);
                field = record.getField(fieldConfig.joinKey ? fieldConfig.joinKey : fieldConfig.fieldName);

                if (field) {
                    if (query) {
                        options = field.getSelectOptions(query, 'contains');
                    } else {
                        options = field.getSelectOptions();
                    }

                    _(options).each(function eachOption(option) {
                        var text = option.getText();
                        var name = (text ? text.split(' : ').pop() : '').trim();
                        optionsValues.push({
                            internalid: option.getId(),
                            name: name,
                            text: text
                        });
                    });
                }
            }
            if (optionsValues.length) {
                return optionsValues;
            }
            return [];
        }
    });
});
