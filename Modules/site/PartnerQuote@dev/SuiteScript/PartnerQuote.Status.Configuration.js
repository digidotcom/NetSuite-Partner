define('PartnerQuote.Status.Configuration', [
], function PartnerQuoteStatusConfiguration(
) {
    'use strict';

    function booleanMap(line, v) {
        return line.getValue(v.fieldName) === 'T';
    }

    return {
        id: 'partner_quote_status',
        type: 'service',
        listHeaderDisabled: true,
        record: 'customrecord_partnerquotestatus',
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
                    fieldName: 'custrecord_partnerquotestatuspublic'
                }
            },
            allowsEdit: {
                record: {
                    fieldName: 'custrecord_partnerquotestatusedit',
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
