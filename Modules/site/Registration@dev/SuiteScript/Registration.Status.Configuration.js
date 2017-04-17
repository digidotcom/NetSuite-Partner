define('Registration.Status.Configuration', [
], function RegistrationStatusConfiguration(
) {
    'use strict';

    function booleanMap(line, v) {
        return line.getValue(v.fieldName) === 'T';
    }

    return {
        id: 'registration_status',
        type: 'service',
        record: 'customrecord_registration_status',
        fields: {
            internalid: {
                record: {
                    fieldName: 'internalid'
                }
            },
            inactive: {
                record: {
                    fieldName: 'isinactive'
                }
            },
            name: {
                record: {
                    fieldName: 'custrecord_registration_status_public'
                }
            },
            allowsEdit: {
                record: {
                    fieldName: 'custrecord_registration_status_edit',
                    applyFunction: booleanMap
                }
            }
        },
        filters: {
            inactive: { operator: 'is', value1: 'F' }
        },
        filtersDynamic: {},
        sort: {
            internalid: 'asc'
        },
        fieldsets: {
            list: [
                'internalid',
                'name',
                'allowsEdit'
            ]
        }
    };
});
