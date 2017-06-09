define('PartnerQuote.Configuration', [], function RegistrationConfiguration() {
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

    return {
        id: 'partner_quote',
        type: 'crud',
        permissions: {
            list: true,
            create: true,
            read: true,
            update: true,
            'delete': false
        },
        status: {
            crudId: 'partner_quote_status',
            filterName: 'status',
            allowEditControlField: 'statusAllowsEdit'
        },
        subrecords: [
            {
                crudId: 'partner_quote_product',
                name: 'products',
                pages: ['view']
            }
        ],
        frontend: {
            baseKey: 'partner-quotes',
            names: {
                singular: 'Partner Quote',
                plural: 'Partner Quotes'
            }
        },
        listColumns: [
            'number',
            'status',
            'approvalDate',
            'expiryDate',
            'companyName',
            'partnerName'
        ],
        groups: [
            { id: 'details', name: 'Partner Quote Details' },
            { id: 'distributor', name: 'Distributor Information' },
            { id: 'customer', name: 'Customer Information' },
            { id: 'supply', name: 'Supply Chain' },
            { id: 'quote', name: 'Quote Information' }
        ],
        record: 'customrecord_partnerquoterequest',
        loggedIn: {
            customer: 'customer'
        },
        filters: {
            inactive: { operator: 'is', value1: 'F' }
        },
        filtersDynamic: {},
        sort: {},
        fieldsets: {
            list: [
                'internalid',
                'status',
                'date',
                'statusAllowsEdit'
            ],
            details: [
                'internalid',
                'inactive',
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
            customer: {
                record: {
                    fieldName: 'custrecord_partnercustomer',
                    type: 'object'
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
                    applyFunction: booleanMap
                }
            },
            approveRejectDate: {
                form: {
                    group: 'details',
                    type: 'date',
                    label: 'Approve Reject Date',
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
                    label: 'Distributor Name'
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
                    label: 'Distributor Buyer Name'
                },
                record: {
                    fieldName: 'custrecord_distbuyername'
                }
            },
            distributorBuyerPhone: {
                form: {
                    group: 'distributor',
                    type: 'text',
                    label: 'Distributor Buyer Phone'
                },
                record: {
                    fieldName: 'custrecord_distbuyerphone'
                }
            },
            distributorBuyerEmail: {
                form: {
                    group: 'distributor',
                    type: 'text',
                    label: 'Distributor Buyer Email'
                },
                record: {
                    fieldName: 'custrecord_distbuyeremail'
                }
            },
            distributorSalesRepName: {
                form: {
                    group: 'distributor',
                    type: 'text',
                    label: 'Distributor Sales Rep Name'
                },
                record: {
                    fieldName: 'custrecord_distsalesrepname'
                }
            },
            distributorSalesRepPhone: {
                form: {
                    group: 'distributor',
                    type: 'text',
                    label: 'Distributor Sales Rep Phone'
                },
                record: {
                    fieldName: 'custrecord_distsalesrepphone'
                }
            },
            distributorSalesRepEmail: {
                form: {
                    group: 'distributor',
                    type: 'text',
                    label: 'Distributor Sales Rep Email'
                },
                record: {
                    fieldName: 'custrecord_distsalesrepemail'
                }
            },
            endCustomerName: {
                form: {
                    group: 'distributor',
                    type: 'text',
                    label: 'End Customer Name'
                },
                record: {
                    fieldName: 'custrecord_endcustomername'
                }
            },

            /* ******* customer information ******* */

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
                    label: 'End Customer Country'
                },
                record: {
                    fieldName: 'custrecord_endcustomercountry',
                    type: 'object',
                    applyFunction: sameIdName,
                    applySetFunction: setText
                }
            },
            endCustomerState: {
                form: {
                    group: 'customer',
                    type: 'list',
                    list: 'states',
                    relatedAttribute: 'endCustomerCountry',
                    nodefault: false,
                    label: 'End Customer State'
                },
                record: {
                    fieldName: 'custrecord_endcustomerstate',
                    type: 'object',
                    applyFunction: sameIdName,
                    applySetFunction: setText
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
                    label: 'End Customer Website'
                },
                record: {
                    fieldName: 'custrecord_endcustomerwebsite'
                }
            },
            commentsCustomerAdditionalInfo: {
                form: {
                    group: 'customer',
                    type: 'longtext',
                    label: 'Comments/Customer Additional Info'
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
                    applyFunction: sameIdName,
                    applySetFunction: setText
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
                    applyFunction: sameIdName,
                    applySetFunction: setText
                }
            },
            contractManufacturer: {
                form: {
                    group: 'supply',
                    type: 'text',
                    label: 'Contract Manufacturer'
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
                    applyFunction: sameIdName,
                    applySetFunction: setText
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
                    applyFunction: sameIdName,
                    applySetFunction: setText
                }
            },

            /* ******* quote information ******* */

            quoteType: {
                form: {
                    group: 'quote',
                    type: 'list',
                    list: 'quote_request_type',
                    label: 'Quote Type'
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
                    label: 'Product Interest'
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
                    label: 'Target Purchase Date'
                },
                record: {
                    fieldName: 'custrecord_targetpurchasedate'
                }
            },
            vertical: {
                form: {
                    group: 'quote',
                    type: 'lookup',
                    label: 'Vertical'
                },
                record: {
                    fieldName: 'custrecord_quotereqvertical',
                    type: 'object'
                }
            },
            application: {
                form: {
                    group: 'quote',
                    type: 'lookup',
                    label: 'Application'
                },
                record: {
                    fieldName: 'custrecord_application',
                    type: 'object'
                }
            },
            registrationExists: {
                form: {
                    group: 'quote',
                    type: 'lookup',
                    label: 'Registration for this project?'
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
                    label: 'Registration'
                },
                record: {
                    fieldName: 'custrecord_quotereqregistration',
                    type: 'object'
                }
            },
            currencyForQuote: {
                form: {
                    group: 'quote',
                    type: 'lookup',
                    label: 'Currency for Quote'
                },
                record: {
                    fieldName: 'custrecord_currencyforquote',
                    type: 'object'
                }
            },
            justificationForDiscount: {
                form: {
                    group: 'quote',
                    type: 'text',
                    label: 'Justification for Price Discount'
                },
                record: {
                    fieldName: 'custrecord_justificationfordiscount'
                }
            },
            competitor: {
                form: {
                    group: 'quote',
                    type: 'lookup',
                    label: 'Competitor'
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
                    label: 'Comments/Additional Info'
                },
                record: {
                    fieldName: 'custrecord_commentsaddlinfo'
                }
            },
            requireDebit: {
                form: {
                    group: 'quote',
                    type: 'lookup',
                    label: 'Require a Debit?'
                },
                record: {
                    fieldName: 'custrecord_requireadebit',
                    type: 'object'
                }
            }
        }
    };
});
