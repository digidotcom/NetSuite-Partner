define('Registration.Status.Configuration', [
], function RegistrationStatusConfiguration(
) {
    'use strict';

    function booleanMap(line, v) {
        return line.getValue(v.fieldName) === 'T';
    }

    return {

        getForCrud: function getForBootstrapping() {
            return {
                record: this.record
            };
        },

        crudId: 'registration_status',

        record: {
            noListHeader: true,
            record: 'customrecord_registration_status',
            columns: {
                internalid: { fieldName: 'internalid' },
                name: { fieldName: 'custrecord_registration_status_public' },
                allowsEdit: { fieldName: 'custrecord_registration_status_edit', applyFunction: booleanMap }
            },
            filters: [
                { fieldName: 'isinactive', operator: 'is', value1: 'F' }
            ],
            sort: { fieldName: 'internalid', order: 'asc' },
            fieldsets: {
                list: [
                    'internalid',
                    'name',
                    'allowsEdit'
                ]
            }
        }
    };
});
