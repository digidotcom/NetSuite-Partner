define('Registration.Configuration', [
    'Utils.CRUD',
    'NavigationTabsDisplay'
], function RegistrationConfiguration(
    UtilsCrud,
    NavigationTabsDisplay
) {
    'use strict';

    var hasAccess = NavigationTabsDisplay.isVisible(NavigationTabsDisplay.tabs.REGISTRATIONS);

    return {
        id: 'registration',
        type: 'crud',
        permissions: {
            list: hasAccess,
            create: hasAccess,
            read: hasAccess,
            update: hasAccess,
            'delete': false
        },
        status: {
            crudId: 'registration_status',
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
                        fieldName: 'partnerApprovalSubmission',
                        value: 'T'
                    }
                ],
                result: {
                    type: 'redirect',
                    page: 'view'
                }
            }
        ],
        subrecords: [
            {
                crudId: 'registration_product',
                name: 'products',
                pages: ['view']
            }
        ],
        frontend: {
            baseKey: 'registrations',
            leftNavIndex: 0,
            idField: 'name',
            names: {
                singular: 'Registration',
                plural: 'Registrations'
            }
        },
        list: {
            id: {
                fieldName: 'name',
                label: 'Digi Id'
            },
            columns: [
                'number',
                'externalReferenceNumber',
                'projectName',
                'productInterest',
                'status',
                'approvalDate',
                'expiryDate',
                'companyName',
                'partnerName'
            ]
        },
        groups: [
            { id: 'details', name: 'Registration Details' },
            { id: 'partner', name: 'Partner Details' },
            { id: 'customer', name: 'End Customer Details' },
            { id: 'supply', name: 'Supply Chain' },
            { id: 'project', name: 'Project Details' }
        ],
        record: 'customrecord_registrationprocess',
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
                'date',
                'number',
                'externalReferenceNumber',
                'status',
                'statusAllowsEdit',
                'approvalDate',
                'expiryDate',
                'companyName',
                'partnerName'
            ],
            details: [
                'internalid',
                'name',
                'date',
                'number',
                'status',
                'statusAllowsEdit',
                'approvalDate',
                'expiryDate',
                'rejectReason',
                'partnerName',
                'additionalInformation',
                'fieldSalesEngineer',
                'buyer',
                'fieldSalesRep',
                'registrationProgram',
                'estimatedValue',
                'externalReferenceNumber',
                'companyName',
                'companyMainPhone',
                'companyAddress',
                'companyAddress2',
                'companyCity',
                'companyCountry',
                'companyState',
                'companyZipCode',
                'contractManufacturer',
                'developmentDesignConsultant',
                'engineerTechnicalContactEmail',
                'engineerTechnicalContactName',
                'engineerTechnicalContactPhone',
                'channelManager',
                'webAddress',
                'leadSource',
                'learnAboutDeal',
                'preferredDistributor',
                'productionDate',
                'projectName',
                'reseller',
                'summaryOfApplication',
                'salesRep',
                'prototypeEvalDate',
                'projectType',
                'projectStatus',
                'productInterest'
            ],
            save: [
                'partnerName',
                'additionalInformation',
                'fieldSalesEngineer',
                'buyer',
                'fieldSalesRep',
                'registrationProgram',
                'estimatedValue',
                'externalReferenceNumber',
                'companyName',
                'companyMainPhone',
                'companyAddress',
                'companyAddress2',
                'companyCity',
                'companyCountry',
                'companyState',
                'companyZipCode',
                'contractManufacturer',
                'developmentDesignConsultant',
                'engineerTechnicalContactEmail',
                'engineerTechnicalContactName',
                'engineerTechnicalContactPhone',
                'webAddress',
                'leadSource',
                'learnAboutDeal',
                'preferredDistributor',
                'productionDate',
                'projectName',
                'reseller',
                'summaryOfApplication',
                'prototypeEvalDate',
                'projectType',
                'projectStatus',
                'productInterest'
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
            date: {
                record: { // Date
                    fieldName: 'created'
                }
            },
            customer: {
                record: {
                    fieldName: 'custrecord_partner_customer',
                    type: 'object'
                }
            },
            contact: {
                record: {
                    fieldName: 'custrecord_partner_contact',
                    type: 'object'
                }
            },
            partnerApprovalSubmission: {
                record: {
                    fieldName: 'custrecord_partner_approval_submission'
                }
            },

            /* ******* registration details ******* */

            number: {
                form: {
                    group: 'details',
                    type: 'text',
                    label: 'Number',
                    labelShort: 'Registration Number',
                    inline: true
                },
                record: { // Free-form Text
                    fieldName: 'custrecord_reg_number'
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
                record: { // List/Record: Registration Status
                    joint: true,
                    internalid: {
                        fieldName: 'custrecord_registration_status'
                    },
                    name: {
                        fieldName: 'custrecord_registration_status_public',
                        joinKey: 'custrecord_registration_status'
                    }
                }
            },
            statusAllowsEdit: {
                record: { // Checkbox
                    fieldName: 'custrecord_registration_status_edit',
                    joinKey: 'custrecord_registration_status',
                    applyFunction: UtilsCrud.booleanMap
                }
            },
            approvalDate: {
                form: {
                    group: 'details',
                    type: 'datetime',
                    label: 'Approval Date',
                    inline: true,
                    required: true
                },
                record: { // Date
                    fieldName: 'custrecord_registration_approval_date'
                }
            },
            expiryDate: {
                form: {
                    group: 'details',
                    type: 'datetime',
                    label: 'Expiry Date',
                    inline: true,
                    required: true
                },
                record: {
                    fieldName: 'custrecord_registration_expiry_date'
                }
            },
            channelManager: {
                form: {
                    group: 'details',
                    type: 'lookup',
                    label: 'Channel Manager',
                    inline: true,
                    required: false
                },
                record: {
                    fieldName: 'custrecord_channel_manager',
                    type: 'object'
                }
            },
            salesRep: {
                form: {
                    group: 'details',
                    type: 'lookup',
                    label: 'Sales Rep',
                    inline: true,
                    required: false
                },
                record: {
                    fieldName: 'custrecord_sales_rep',
                    type: 'object'
                }
            },
            registrationProgram: {
                form: {
                    group: 'details',
                    type: 'list',
                    list: 'registration_program',
                    label: 'Registration Program',
                    defaultValue: 1,
                    required: true
                },
                record: {
                    fieldName: 'custrecord_reg_program',
                    type: 'object'
                }
            },
            estimatedValue: {
                form: {
                    group: 'details',
                    type: 'currency',
                    label: 'Estimated Value',
                    inline: true,
                    required: false
                },
                record: {
                    fieldName: 'custrecord_reg_estimated_value'
                }
            },
            rejectReason: {
                form: {
                    group: 'details',
                    type: 'longtext',
                    label: 'Reject Reason',
                    inline: true
                },
                record: {
                    fieldName: 'custrecord_rp_reject_reason'
                }
            },

            /* ******* partner details ******* */

            partnerName: {
                form: {
                    group: 'partner',
                    type: 'lookup',
                    label: 'Partner Name',
                    defaultValue: UtilsCrud.partnerNameDefaultValue,
                    inline: true,
                    required: true
                },
                record: {
                    fieldName: 'custrecord_partner_name',
                    type: 'object'
                }
            },
            fieldSalesEngineer: {
                form: {
                    group: 'partner',
                    type: 'lookup',
                    label: 'Partner Field Sales Engineer',
                    required: true
                },
                record: {
                    joint: true,
                    internalid: {
                        fieldName: 'custrecord_partner_field_sales_engr'
                    },
                    name: {
                        fieldName: 'entityid',
                        joinKey: 'custrecord_partner_field_sales_engr'
                    }
                },
                lookup: {
                    applyFunction: UtilsCrud.partnerContactsLookup
                }
            },
            buyer: {
                form: {
                    group: 'partner',
                    type: 'lookup',
                    label: 'Partner Buyer',
                    required: false
                },
                record: {
                    joint: true,
                    internalid: {
                        fieldName: 'custrecord_partner_buyer'
                    },
                    name: {
                        fieldName: 'entityid',
                        joinKey: 'custrecord_partner_buyer'
                    }
                },
                lookup: {
                    applyFunction: UtilsCrud.partnerContactsLookup
                }
            },
            fieldSalesRep: {
                form: {
                    group: 'partner',
                    type: 'lookup',
                    label: 'Partner Field Sales Rep',
                    required: true
                },
                record: {
                    joint: true,
                    internalid: {
                        fieldName: 'custrecord_partner_field_sales_rep'
                    },
                    name: {
                        fieldName: 'entityid',
                        joinKey: 'custrecord_partner_field_sales_rep'
                    }
                },
                lookup: {
                    applyFunction: UtilsCrud.partnerContactsLookup
                }
            },
            externalReferenceNumber: {
                form: {
                    group: 'partner',
                    type: 'text',
                    label: 'Distributor External Id',
                    required: false
                },
                record: {
                    fieldName: 'custrecord_external_reference_numb'
                }
            },

            /* ******* end customer details ******* */

            companyName: {
                form: {
                    group: 'customer',
                    type: 'text',
                    label: 'Company Name (End Customer/OEM, ODM)',
                    labelShort: 'End Customer Name',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_company_name'
                }
            },
            companyMainPhone: {
                form: {
                    group: 'customer',
                    type: 'phone',
                    label: 'Main Phone',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_company_main_phone'
                }
            },
            companyAddress: {
                form: {
                    group: 'customer',
                    type: 'text',
                    label: 'Address',
                    required: false
                },
                record: {
                    fieldName: 'custrecord_company_address'
                }
            },
            companyAddress2: {
                form: {
                    group: 'customer',
                    type: 'text',
                    label: 'Address 2',
                    required: false
                },
                record: {
                    fieldName: 'custrecord_company_address2'
                }
            },
            companyCity: {
                form: {
                    group: 'customer',
                    type: 'text',
                    label: 'City',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_company_city'
                }
            },
            companyCountry: {
                form: {
                    group: 'customer',
                    type: 'list',
                    list: 'countries',
                    label: 'Country',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_company_country',
                    type: 'object',
                    applyFunction: UtilsCrud.sameIdName,
                    applySetFunction: UtilsCrud.setText
                }
            },
            companyState: {
                form: {
                    group: 'customer',
                    type: 'list',
                    list: 'states',
                    relatedAttribute: 'companyCountry',
                    nodefault: false,
                    label: 'State',
                    tooltip: 'Depends on the selected country',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_company_state',
                    type: 'object',
                    applyFunction: UtilsCrud.sameIdName,
                    applySetFunction: UtilsCrud.setText
                }
            },
            companyZipCode: {
                form: {
                    group: 'customer',
                    type: 'number',
                    label: 'Zip/Postal Code',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_country_zipcode'
                }
            },
            engineerTechnicalContactName: {
                form: {
                    group: 'customer',
                    type: 'text',
                    label: 'Engineer/Technical Contact Name',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_engr_contact_name'
                }
            },
            engineerTechnicalContactEmail: {
                form: {
                    group: 'customer',
                    type: 'email',
                    label: 'Engineer/Technical Contact Email',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_engr_contact_email'
                }
            },
            engineerTechnicalContactPhone: {
                form: {
                    group: 'customer',
                    type: 'phone',
                    label: 'Engineer/Technical Contact Phone',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_engr_contact_phone'
                }
            },
            webAddress: {
                form: {
                    group: 'customer',
                    type: 'text',
                    label: 'Web Address',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_reg_web_address'
                }
            },
            leadSource: {
                form: {
                    group: 'customer',
                    type: 'list',
                    list: 'registration_lead_source',
                    label: 'Lead Source',
                    required: false
                },
                record: {
                    fieldName: 'custrecord_reg_lead_source',
                    type: 'object'
                }
            },

            /* ******* supply chain ******* */

            contractManufacturer: {
                form: {
                    group: 'supply',
                    type: 'text',
                    label: 'Contract Manufacturer',
                    required: false
                },
                record: {
                    fieldName: 'custrecord_contract_manufacturer'
                }
            },
            developmentDesignConsultant: {
                form: {
                    group: 'supply',
                    type: 'text',
                    label: 'Development/Design Consultant',
                    required: false
                },
                record: {
                    fieldName: 'custrecord_development_design_consultant'
                }
            },
            preferredDistributor: {
                form: {
                    group: 'supply',
                    type: 'text',
                    label: 'Preferred Distributor',
                    required: false
                },
                record: {
                    fieldName: 'custrecord_preferred_distributor'
                }
            },
            reseller: {
                form: {
                    group: 'supply',
                    type: 'text',
                    label: 'Reseller',
                    required: false
                },
                record: {
                    fieldName: 'custrecord_reseller'
                }
            },

            /* ******* project details ******* */

            learnAboutDeal: {
                form: {
                    group: 'project',
                    type: 'longtext',
                    label: 'How did you learn about this deal?',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_learn_about_deal'
                }
            },
            productionDate: {
                form: {
                    group: 'project',
                    type: 'date',
                    label: 'Production Date',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_production_date'
                }
            },
            projectName: {
                form: {
                    group: 'project',
                    type: 'text',
                    label: 'Project Name',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_project_name'
                }
            },
            summaryOfApplication: {
                form: {
                    group: 'project',
                    type: 'longtext',
                    label: 'Summary Of Application',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_summary_of_application'
                }
            },
            prototypeEvalDate: {
                form: {
                    group: 'project',
                    type: 'date',
                    label: 'Prototype/Eval Date',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_prototype_eval_date'
                }
            },
            projectType: {
                form: {
                    group: 'project',
                    type: 'list',
                    list: 'registration_project_type',
                    label: 'Project Type',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_reg_project_type',
                    type: 'object'
                }
            },
            projectStatus: {
                form: {
                    group: 'project',
                    type: 'list',
                    list: 'registration_project_status',
                    label: 'Project Status',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_reg_project_status',
                    type: 'object'
                }
            },
            productInterest: {
                form: {
                    group: 'project',
                    type: 'list',
                    list: 'product_interest',
                    label: 'Product Interest',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_reg_product_interest',
                    type: 'object'
                }
            },
            additionalInformation: {
                form: {
                    group: 'project',
                    type: 'longtext',
                    label: 'Additional Information',
                    required: false
                },
                record: {
                    fieldName: 'custrecord_additional_information'
                }
            }
        }
    };
});
