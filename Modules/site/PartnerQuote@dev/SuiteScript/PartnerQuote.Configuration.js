define('PartnerQuote.Configuration', [
    'Utils.CRUD',
    'NavigationTabsDisplay'
], function PartnerQuoteConfiguration(
    UtilsCrud,
    NavigationTabsDisplay
) {
    'use strict';

    var hasAccess = NavigationTabsDisplay.isVisible(NavigationTabsDisplay.tabs.PQR);

    return {
        id: 'partner_quote',
        type: 'crud',
        permissions: {
            list: hasAccess,
            create: hasAccess,
            read: hasAccess,
            update: hasAccess,
            'delete': false
        },
        status: {
            crudId: 'partner_quote_status',
            filterName: 'status',
            allowEditControlField: 'statusAllowsEdit'
        },
        actions: [
            {
                name: 'submit',
                label: 'Submit',
                conditions: [
                    {
                        type: 'page',
                        values: ['view']
                    },
                    {
                        type: 'field',
                        fieldName: 'statusAllowsEdit',
                        values: [true]
                    }
                ],
                execute: [
                    {
                        type: 'field',
                        fieldName: 'partnerPqrSubmission',
                        value: 'T'
                    }
                ],
                result: {
                    type: 'redirect',
                    page: 'list'
                }
            }
        ],
        subrecords: [
            {
                crudId: 'partner_quote_product',
                name: 'products',
                pages: ['view']
            }
        ],
        frontend: {
            baseKey: 'partner-quotes',
            leftNavIndex: 1,
            idField: 'name',
            names: {
                singular: 'Quote Request',
                plural: 'Quote Requests'
            }
        },
        list: {
            id: {
                fieldName: 'name',
                label: 'Digi Id'
            },
            columns: [
                'number',
                'registration',
                'endCustomerName',
                'approveRejectDate',
                'status'
            ]
        },
        groups: [
            { id: 'details', name: 'Partner Quote Details' },
            { id: 'distributor', name: 'Distributor Information' },
            { id: 'customer', name: 'Customer Information' },
            { id: 'supply', name: 'Supply Chain' },
            { id: 'quote', name: 'Quote Information' }
        ],
        record: 'customrecord_partnerquoterequest',
        loggedIn: {
            customer: 'customer',
            contact: 'contact'
        },
        filters: {
            inactive: { operator: 'is', value1: 'F' }
        },
        filtersDynamic: {},
        sort: {},
        fieldsets: {
            list: [
                'internalid',
                'name',
                'registration',
                'endCustomerName',
                'approveRejectDate',
                'status',
                'date',
                'statusAllowsEdit'
            ],
            details: [
                'internalid',
                'inactive',
                'name',
                'date',
                'status',
                'statusAllowsEdit',
                'approveRejectDate',
                'distributor',
                'distributorBuyerName',
                'distributorBuyerPhone',
                'distributorBuyerEmail',
                'distributorSalesRepName',
                'distributorSalesRepPhone',
                'distributorSalesRepEmail',
                'endCustomerName',
                'endCustomerMainAddress',
                'endCustomerMainAddress2',
                'endCustomerCity',
                'endCustomerCountry',
                'endCustomerState',
                'endCustomerPostalCode',
                'endCustomerWebsite',
                'commentsCustomerAdditionalInfo',
                'resellerName',
                'resellerBillToCountry',
                'resellerBillToState',
                'contractManufacturer',
                'contractManufacturerBillToCountry',
                'contractManufacturerBillToState',
                'quoteType',
                'productInterest',
                'targetPurchaseDate',
                'vertical',
                'application',
                'registrationExists',
                'registration',
                'currencyForQuote',
                'justificationForDiscount',
                'competitor',
                'competitorPartNumbers',
                'competitorUnitPrices',
                'commentsAdditionalInfo',
                'requireDebit'
            ],
            save: [
                'distributor',
                'distributorBuyerName',
                'distributorBuyerPhone',
                'distributorBuyerEmail',
                'distributorSalesRepName',
                'distributorSalesRepPhone',
                'distributorSalesRepEmail',
                'endCustomerName',
                'endCustomerMainAddress',
                'endCustomerMainAddress2',
                'endCustomerCity',
                'endCustomerCountry',
                'endCustomerState',
                'endCustomerPostalCode',
                'endCustomerWebsite',
                'commentsCustomerAdditionalInfo',
                'resellerName',
                'resellerBillToCountry',
                'resellerBillToState',
                'contractManufacturer',
                'contractManufacturerBillToCountry',
                'contractManufacturerBillToState',
                'quoteType',
                'productInterest',
                'targetPurchaseDate',
                'vertical',
                'application',
                'registrationExists',
                'registration',
                'currencyForQuote',
                'justificationForDiscount',
                'competitor',
                'competitorPartNumbers',
                'competitorUnitPrices',
                'commentsAdditionalInfo',
                'requireDebit'
            ]
        },
        fields: {
            /* ******* internal ******* */

            internalid: {
                record: { // Integer Number
                    fieldName: 'internalid'
                }
            },
            inactive: {
                record: { // Checkbox
                    fieldName: 'isinactive'
                }
            },
            name: {
                record: {
                    fieldName: 'name'
                }
            },
            customer: {
                record: {
                    fieldName: 'custrecord_partnercustomer',
                    type: 'object'
                }
            },
            contact: {
                record: {
                    fieldName: 'custrecord_pqr_partner_contact',
                    type: 'object'
                }
            },
            partnerPqrSubmission: {
                record: {
                    fieldName: 'custrecord_pqr_partner_submission'
                }
            },

            /* ******* partner quote details ******* */

            date: {
                form: {
                    group: 'details',
                    type: 'date',
                    label: 'Creation Date',
                    inline: true
                },
                record: {
                    fieldName: 'created'
                }
            },
            status: {
                form: {
                    group: 'details',
                    type: 'list',
                    label: 'Status',
                    inline: true,
                    required: true
                },
                record: {
                    joint: true,
                    internalid: {
                        fieldName: 'custrecord_partnerquotestatus'
                    },
                    name: {
                        fieldName: 'custrecord_partnerquotestatuspublic',
                        joinKey: 'custrecord_partnerquotestatus'
                    }
                }
            },
            statusAllowsEdit: {
                record: {
                    fieldName: 'custrecord_partnerquotestatusedit',
                    joinKey: 'custrecord_partnerquotestatus',
                    applyFunction: UtilsCrud.booleanMap
                }
            },
            approveRejectDate: {
                form: {
                    group: 'details',
                    type: 'date',
                    label: 'Approve/Reject Date',
                    inline: true
                },
                record: {
                    fieldName: 'custrecord_approverejectdate'
                }
            },

            /* ******* distributor information ******* */

            distributor: {
                form: {
                    group: 'distributor',
                    type: 'lookup',
                    label: 'Distributor Name',
                    defaultValue: UtilsCrud.partnerNameDefaultValue,
                    inline: true,
                    required: true
                },
                record: {
                    fieldName: 'custrecord_distributor',
                    type: 'object'
                }
            },
            distributorBuyerName: {
                form: {
                    group: 'distributor',
                    type: 'text',
                    label: 'Distributor Buyer Name',
                    tooltip: 'List the name of the buyer or purchasing agent that will be issuing the PO from your company to Digi.',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_distbuyername'
                }
            },
            distributorBuyerPhone: {
                form: {
                    group: 'distributor',
                    type: 'phone',
                    label: 'Distributor Buyer Phone',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_distbuyerphone'
                }
            },
            distributorBuyerEmail: {
                form: {
                    group: 'distributor',
                    type: 'email',
                    label: 'Distributor Buyer Email',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_distbuyeremail'
                }
            },
            distributorSalesRepName: {
                form: {
                    group: 'distributor',
                    type: 'text',
                    label: 'Distributor Sales Rep Name',
                    tooltip: 'List the name of the sales representative at you company that is responsible for this opportunity.',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_distsalesrepname'
                }
            },
            distributorSalesRepPhone: {
                form: {
                    group: 'distributor',
                    type: 'phone',
                    label: 'Distributor Sales Rep Phone',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_distsalesrepphone'
                }
            },
            distributorSalesRepEmail: {
                form: {
                    group: 'distributor',
                    type: 'email',
                    label: 'Distributor Sales Rep Email',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_distsalesrepemail'
                }
            },

            /* ******* customer information ******* */

            endCustomerName: {
                form: {
                    group: 'customer',
                    type: 'text',
                    label: 'End Customer Name',
                    tooltip: 'List the name of the OEM or end-customer that is developing this product and will be selling and ' +
                             'marketing the finished goods under their own brand. Do not list the name of the contract manufacturer, ' +
                             'reseller, distributor, design consultant, etc.',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_endcustomername'
                }
            },
            endCustomerMainAddress: {
                form: {
                    group: 'customer',
                    type: 'text',
                    label: 'End Customer Main Address'
                },
                record: {
                    fieldName: 'custrecord_endcustomermainaddress'
                }
            },
            endCustomerMainAddress2: {
                form: {
                    group: 'customer',
                    type: 'text',
                    label: 'End Customer Main Address 2'
                },
                record: {
                    fieldName: 'custrecord_endcustomermainaddress2'
                }
            },
            endCustomerCity: {
                form: {
                    group: 'customer',
                    type: 'text',
                    label: 'End Customer City'
                },
                record: {
                    fieldName: 'custrecord_endcustomercity'
                }
            },
            endCustomerCountry: {
                form: {
                    group: 'customer',
                    type: 'list',
                    list: 'countries',
                    nodefault: false,
                    label: 'End Customer Country',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_endcustomercountry',
                    type: 'object',
                    applyFunction: UtilsCrud.sameIdName,
                    applySetFunction: UtilsCrud.setText
                }
            },
            endCustomerState: {
                form: {
                    group: 'customer',
                    type: 'list',
                    list: 'states',
                    relatedAttribute: 'endCustomerCountry',
                    nodefault: false,
                    label: 'End Customer State',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_endcustomerstate',
                    type: 'object',
                    applyFunction: UtilsCrud.sameIdName,
                    applySetFunction: UtilsCrud.setText
                }
            },
            endCustomerPostalCode: {
                form: {
                    group: 'customer',
                    type: 'text',
                    label: 'End Customer Postal Code'
                },
                record: {
                    fieldName: 'custrecord_endcustomerpostalcode'
                }
            },
            endCustomerWebsite: {
                form: {
                    group: 'customer',
                    type: 'text',
                    label: 'End Customer Website',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_endcustomerwebsite'
                }
            },
            commentsCustomerAdditionalInfo: {
                form: {
                    group: 'customer',
                    type: 'longtext',
                    label: 'Comments/Customer Additional Info',
                    tooltip: 'Should be used to give additional information about the customer, reseller, CM, or the relationship ' +
                             'between the entities.'
                },
                record: {
                    fieldName: 'custrecord_commentscustaddlinfo'
                }
            },

            /* ******* supply chain ******* */

            resellerName: {
                form: {
                    group: 'supply',
                    type: 'text',
                    label: 'Reseller Name'
                },
                record: {
                    fieldName: 'custrecord_resellername'
                }
            },
            resellerBillToCountry: {
                form: {
                    group: 'supply',
                    type: 'list',
                    list: 'countries',
                    nodefault: false,
                    label: 'Reseller Bill To Country'
                },
                record: {
                    fieldName: 'custrecord_resellerbilltocountry',
                    type: 'object',
                    applyFunction: UtilsCrud.sameIdName,
                    applySetFunction: UtilsCrud.setText
                }
            },
            resellerBillToState: {
                form: {
                    group: 'supply',
                    type: 'list',
                    list: 'states',
                    relatedAttribute: 'resellerBillToCountry',
                    nodefault: false,
                    label: 'Reseller Bill to State'
                },
                record: {
                    fieldName: 'custrecord_resellerbilltostate',
                    type: 'object',
                    applyFunction: UtilsCrud.sameIdName,
                    applySetFunction: UtilsCrud.setText
                }
            },
            contractManufacturer: {
                form: {
                    group: 'supply',
                    type: 'text',
                    label: 'Contract Manufacturer',
                    tooltip: 'Please identify the Contract Manufacturer or Design House involved in this project, if applicable.'
                },
                record: {
                    fieldName: 'custrecord_contractmanufacturer'
                }
            },
            contractManufacturerBillToCountry: {
                form: {
                    group: 'supply',
                    type: 'list',
                    list: 'countries',
                    nodefault: false,
                    label: 'Contract Manufacturer Bill to Country'
                },
                record: {
                    fieldName: 'custrecord_contmfrbilltocountry',
                    type: 'object',
                    applyFunction: UtilsCrud.sameIdName,
                    applySetFunction: UtilsCrud.setText
                }
            },
            contractManufacturerBillToState: {
                form: {
                    group: 'supply',
                    type: 'list',
                    list: 'states',
                    relatedAttribute: 'contractManufacturerBillToCountry',
                    nodefault: false,
                    label: 'Contract Manufacturer Bill to State'
                },
                record: {
                    fieldName: 'custrecord_contmfrbilltostate',
                    type: 'object',
                    applyFunction: UtilsCrud.sameIdName,
                    applySetFunction: UtilsCrud.setText
                }
            },

            /* ******* quote information ******* */

            quoteType: {
                form: {
                    group: 'quote',
                    type: 'list',
                    list: 'quote_request_type',
                    label: 'Quote Type',
                    tooltip: 'Select the type of items or services that are being listed on this quote.'
                },
                record: {
                    fieldName: 'custrecord_quotetype',
                    type: 'object'
                }
            },
            productInterest: {
                form: {
                    group: 'quote',
                    type: 'list',
                    list: 'product_interest',
                    label: 'Product Interest',
                    tooltip: 'Choose the Product category that best fits the requested product. The partner price list provides ' +
                             'the Product Type for every SKU for reference.',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_quotereqproductinterest',
                    type: 'object'
                }
            },
            targetPurchaseDate: {
                form: {
                    group: 'quote',
                    type: 'date',
                    label: 'Target Purchase Date',
                    tooltip: 'The date the end customer expects to purchase.',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_targetpurchasedate'
                }
            },
            vertical: {
                form: {
                    group: 'quote',
                    type: 'list',
                    list: 'vertical',
                    label: 'Vertical Market',
                    tooltip: 'Select the option that most closely matches the market segment that this product will service.'
                },
                record: {
                    fieldName: 'custrecord_quotereqvertical',
                    type: 'object'
                }
            },
            application: {
                form: {
                    group: 'quote',
                    type: 'list',
                    list: 'quote_request_application',
                    label: 'Application',
                    tooltip: 'Select the option that most closely matches the function that this product will provide in the vertical market.'
                },
                record: {
                    fieldName: 'custrecord_application',
                    type: 'object'
                }
            },
            registrationExists: {
                form: {
                    group: 'quote',
                    type: 'list',
                    list: 'yes_no',
                    label: 'Do you have a Registration for this project?',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_registrationexists',
                    type: 'object'
                }
            },
            registration: {
                form: {
                    group: 'quote',
                    type: 'lookup',
                    label: 'Registration Number'
                },
                record: {
                    joint: true,
                    internalid: {
                        fieldName: 'custrecord_quotereqregistration'
                    },
                    name: {
                        fieldName: 'custrecord_reg_dispay_id',
                        joinKey: 'custrecord_quotereqregistration'
                    }
                },
                lookup: {
                    applyFunction: UtilsCrud.partnerRegistrationsLookup
                }
            },
            currencyForQuote: {
                form: {
                    group: 'quote',
                    type: 'list',
                    list: 'currency',
                    defaultValue: '1',
                    label: 'Currency for Quote',
                    tooltip: 'Currency limitations will apply based on contract terms.',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_currencyforquote',
                    type: 'object'
                }
            },
            justificationForDiscount: {
                form: {
                    group: 'quote',
                    type: 'longtext',
                    label: 'Justification for Price Discount',
                    tooltip: 'If no discount is being requested, list \'Standard Pricing\'',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_justificationfordiscount'
                }
            },
            competitor: {
                form: {
                    group: 'quote',
                    type: 'text',
                    label: 'Competitor',
                    tooltip: 'List the name of the primary competitor to Digi in the opportunity.'
                },
                record: {
                    fieldName: 'custrecord_competitor',
                    type: 'object'
                }
            },
            competitorPartNumbers: {
                form: {
                    group: 'quote',
                    type: 'text',
                    label: 'Competitor Part Number(s)'
                },
                record: {
                    fieldName: 'custrecord_comppartnumbers'
                }
            },
            competitorUnitPrices: {
                form: {
                    group: 'quote',
                    type: 'text',
                    label: 'Competitor Unit Prices(s)'
                },
                record: {
                    fieldName: 'custrecord_compunitprices'
                }
            },
            commentsAdditionalInfo: {
                form: {
                    group: 'quote',
                    type: 'longtext',
                    label: 'Comments/Additional Info',
                    tooltip: 'Use this to add additional information, notes, or additional part nbumbers for the quote.'
                },
                record: {
                    fieldName: 'custrecord_commentsaddlinfo'
                }
            },
            requireDebit: {
                form: {
                    group: 'quote',
                    type: 'list',
                    list: 'yes_no',
                    defaultValue: '2',
                    label: 'Require a Debit?',
                    tooltip: 'Does this quote also require a Ship and Debit to be created automatically upon quote approval?'
                },
                record: {
                    fieldName: 'custrecord_requireadebit',
                    type: 'object'
                }
            }
        }
    };
});
