define('Utils.CRUD', [
    'Models.Init'
], function UtilsCrud(
    ModelsInit
) {
    'use strict';

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

    return {
        sameIdName: sameIdName,
        booleanMap: booleanMap,
        setText: setText,
        partnerNameDefaultValue: partnerNameDefaultValue
    };
});
