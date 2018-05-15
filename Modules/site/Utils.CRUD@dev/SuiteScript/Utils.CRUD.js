define('Utils.CRUD', [
    'underscore',
    'Models.Init',
    'Application',
    'Configuration'
], function UtilsCrudModule(
    _,
    ModelsInit,
    Application,
    Configuration
) {
    'use strict';

    var UtilsCrud = {};

    function sameIdName(line, v) {
        var value = line.getText(
            v.fieldName,
            v.joinKey ? v.joinKey : null,
            v.summary ? v.summary : null
        );
        return {
            internalid: value,
            name: value
        };
    }
    function booleanMap(line, v) {
        var value = line.getValue(
            v.fieldName,
            v.joinKey ? v.joinKey : null,
            v.summary ? v.summary : null
        );
        return value === 'T';
    }
    function setText(record, fieldInfo, value) {
        record.setFieldText(fieldInfo.fieldName, value);
    }

    function partnerNameDefaultValue() {
        var customer = ModelsInit.customer.getFieldValues(['name']);
        return {
            internalid: nlapiGetUser(),
            name: customer.name
        };
    }

    function partnerContactsLookup(data) {
        var query = data.query;
        var customerId = nlapiGetUser();
        var contacts = [];
        var filters = [
            new nlobjSearchFilter('isinactive', null, 'is', 'F'),
            new nlobjSearchFilter('company', null, 'is', customerId + '')
        ];
        var columns = [
            new nlobjSearchColumn('internalid'),
            new nlobjSearchColumn('entityid')
        ];
        var results;
        if (customerId) {
            results = Application.getAllSearchResults('contact', filters, columns);
            _(results).each(function eachResults(result) {
                var internalId = result.getValue('internalid');
                var name = result.getValue('entityid');
                if (!query || (name.toLowerCase().indexOf(query.toLowerCase()) >= 0)) {
                    contacts.push({
                        internalid: internalId,
                        name: name,
                        text: name
                    });
                }
            });
        }
        return contacts;
    }

    function partnerRegistrationsLookup(data) {
        var query = data.query;
        var customerId = nlapiGetUser();
        var registrations = [];
        var filters = [
            new nlobjSearchFilter('isinactive', null, 'is', 'F'),
            new nlobjSearchFilter('custrecord_partner_customer', null, 'is', customerId + '')
        ];
        var columns = [
            new nlobjSearchColumn('internalid'),
            new nlobjSearchColumn('name'),
            new nlobjSearchColumn('custrecord_reg_dispay_id')
        ];
        var results;
        if (customerId) {
            results = Application.getAllSearchResults('customrecord_registrationprocess', filters, columns);
            _(results).each(function eachResults(result) {
                var internalId = result.getValue('internalid');
                var name = result.getValue('custrecord_reg_dispay_id');
                if (!query || (name.toLowerCase().indexOf(query.toLowerCase()) >= 0)) {
                    registrations.push({
                        internalid: internalId,
                        name: name,
                        text: name
                    });
                }
            });
        }
        return registrations;
    }

    function getConvertPlaceholderValues() {
        var placeholderValuesConfig;
        if (!UtilsCrud.convertPlaceholderValues) {
            placeholderValuesConfig = Configuration.get('convertToQuote.placeholderValues', {});

            UtilsCrud.convertPlaceholderValues = {};
            _(placeholderValuesConfig).each(function eachPlaceholderValue(placeholderValue) {
                UtilsCrud.convertPlaceholderValues[placeholderValue.field] = placeholderValue.value;
            });
        }
        return UtilsCrud.convertPlaceholderValues;
    }

    function getConvertPlaceholder(field) {
        var values = UtilsCrud.getConvertPlaceholderValues();
        return values[field] || 'N/A';
    }

    _(UtilsCrud).extend({
        sameIdName: sameIdName,
        booleanMap: booleanMap,
        setText: setText,
        partnerNameDefaultValue: partnerNameDefaultValue,
        partnerContactsLookup: partnerContactsLookup,
        partnerRegistrationsLookup: partnerRegistrationsLookup,
        getConvertPlaceholderValues: getConvertPlaceholderValues,
        getConvertPlaceholder: getConvertPlaceholder
    });

    return UtilsCrud;
});
