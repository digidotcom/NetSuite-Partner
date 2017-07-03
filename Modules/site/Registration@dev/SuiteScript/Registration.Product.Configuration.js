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
        parent: {
            crudId: 'registration',
            filterName: 'registration',
            allowEditSync: true
        },
        list: {
            columns: [
                'item',
                'partNumber',
                'quantity',
                'targetResalePrice'
            ]
        },
        groups: [
            { id: 'default', name: '' }
        ],
        record: 'customrecord_registration_product',
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
                'quantity',
                'targetResalePrice'
            ],
            details: [
                'internalid',
                'registration',
                'item',
                'partNumber',
                'quantity',
                'targetResalePrice'
            ],
            save: [
                'registration',
                'item',
                'quantity',
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
            registration: {
                form: {
                    type: 'hidden'
                },
                record: {
                    fieldName: 'custrecord_registration_process'
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
                    fieldName: 'custrecord_reg_item',
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
                    joinKey: 'custrecord_reg_item'
                }
            },
            quantity: {
                form: {
                    group: 'default',
                    type: 'number',
                    label: 'Quantity',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_reg_quantity'
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
                    fieldName: 'custrecord_target_resale_price'
                }
            }
        }
    };
});
