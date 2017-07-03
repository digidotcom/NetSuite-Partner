define('PartnerQuote.Product.Configuration', [
], function PartnerQuoteProductConfiguration(
) {
    'use strict';

    return {
        id: 'partner_quote_product',
        type: 'subrecord',
        permissions: {
            list: true,
            create: true,
            read: true,
            update: true,
            'delete': false
        },
        frontend: {
            baseKey: 'quote-products',
            inlineEdit: true,
            names: {
                singular: 'Quote Request Product',
                plural: 'Quote Request Products'
            }
        },
        parent: {
            crudId: 'partner_quote',
            filterName: 'partnerQuote',
            allowEditSync: true
        },
        list: {
            columns: [
                'item',
                'partNumber',
                'estimatedAnnualQuantity',
                'targetResalePrice'
            ]
        },
        groups: [
            { id: 'default', name: '' }
        ],
        record: 'customrecord_partnerquoteproduct',
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
                'partnerQuote',
                'item',
                'partNumber',
                'estimatedAnnualQuantity',
                'targetResalePrice'
            ],
            details: [
                'internalid',
                'partnerQuote',
                'item',
                'partNumber',
                'estimatedAnnualQuantity',
                'targetResalePrice'
            ],
            save: [
                'partnerQuote',
                'item',
                'estimatedAnnualQuantity',
                'targetResalePrice'
            ]
        },
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
            partnerQuote: {
                form: {
                    type: 'hidden'
                },
                record: {
                    fieldName: 'custrecord_partnerquoterequest'
                }
            },
            item: {
                form: {
                    group: 'default',
                    type: 'lookup',
                    label: 'Product',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_item',
                    type: 'object'
                }
            },
            partNumber: {
                form: {
                    group: 'default',
                    type: 'text',
                    label: 'Part Number',
                    relatedAttribute: 'item',
                    inline: true
                },
                record: {
                    fieldName: 'itemid',
                    joinKey: 'custrecord_item'
                }
            },
            estimatedAnnualQuantity: {
                form: {
                    group: 'default',
                    type: 'number',
                    label: 'Estimated Annual Quantity',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_estannualqty'
                }
            },
            targetResalePrice: {
                form: {
                    group: 'default',
                    type: 'currency',
                    label: 'Target Resale Price',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_targetresaleprice'
                }
            }
        }
    };
});
