define('Registration.Product.Configuration', [
], function RegistrationProductConfiguration(
) {
    'use strict';

    return {
        id: 'registration_product',
        type: 'subrecord',
        permissions: {
            list: true,
            create: true,
            read: true,
            update: true,
            'delete': true
        },
        frontend: {
            baseKey: 'products',
            inlineEdit: true,
            names: {
                singular: 'Registration Product',
                plural: 'Registration Products'
            }
        },
        parentFieldName: 'registration',
        listColumns: [
            'item',
            'partNumber',
            'productType',
            'quantity',
            'targetResalePrice',
            'distributorPrice'/* ,
            'total' */
        ],
        record: 'customrecord_registration_product',
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
            registration: {
                record: {
                    fieldName: 'custrecord_registration_process'
                }
            },
            item: {
                form: {
                    type: 'lookup',
                    label: 'Product'
                },
                record: {
                    fieldName: 'custrecord_reg_item',
                    type: 'object'
                }
            },
            partNumber: {
                form: {
                    type: 'text',
                    label: 'Part Number',
                    relatedAttribute: 'item',
                    inline: true
                },
                record: {
                    fieldName: 'itemid',
                    joinKey: 'custrecord_reg_item'
                }
            },
            /* productType: {
                form: {
                    type: 'text',
                    label: 'Product Type',
                    relatedAttribute: 'item',
                    inline: true
                },
                record: {
                    fieldName: 'custitem_cseg_cs_producttype',
                    joinKey: 'custrecord_reg_item'
                }
            },*/
            quantity: {
                form: {
                    type: 'number',
                    label: 'Quantity'
                },
                record: {
                    fieldName: 'custrecord_reg_quantity'
                }
            },
            targetResalePrice: {
                form: {
                    type: 'currency',
                    label: 'Target Resale Price'
                },
                record: {
                    fieldName: 'custrecord_target_resale_price'
                }
            },
            distributorPrice: {
                form: {
                    type: 'currency',
                    label: 'Distributor Price',
                    relatedAttribute: 'item',
                    inline: true
                },
                record: {
                    fieldName: 'onlinecustomerprice',
                    joinKey: 'custrecord_reg_item'
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
                'registration',
                'item',
                'partNumber',
                // 'productType',
                'quantity',
                'targetResalePrice',
                'distributorPrice'
            ]
        }
    };
});
