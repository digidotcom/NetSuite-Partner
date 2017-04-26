define('Registration.Configuration', [], function RegistrationConfiguration() {
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
        id: 'registration',
        type: 'crud',
        permissions: {
            list: true,
            create: true,
            read: true,
            update: true,
            'delete': false
        },
        status: {
            crudId: 'registration_status',
            filterName: 'status',
            allowEditControlField: 'statusAllowsEdit'
        },
        subrecords: [
            {
                crudId: 'registration_product',
                name: 'products',
                pages: ['view']
            }
        ],
        frontend: {
            baseKey: 'registrations',
            names: {
                singular: 'Registration',
                plural: 'Registrations'
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
            { id: 'details', name: 'Registration Details' },
            { id: 'partner', name: 'Partner Details' },
            { id: 'customer', name: 'End Customer Details' },
            { id: 'supply', name: 'Supply Chain' },
            { id: 'project', name: 'Project Details' }
        ],
        record: 'customrecord_registrationprocess',
        loggedInFilterField: 'customer',
        filters: {
            inactive: { operator: 'is', value1: 'F' }
        },
        filtersDynamic: {},
        sort: {},
        fieldsets: {
            list: [
                'internalid',
                'date',
                'number',
                'status',
                'statusAllowsEdit',
                'approvalDate',
                'expiryDate',
                'companyName',
                'partnerName'
            ],
            details: [
                'internalid',
                'date',
                'number',
                'status',
                'statusAllowsEdit',
                'approvalDate',
                'expiryDate',
                'partnerName',
                'additionalInformation',
                'fieldSalesEngineer',
                'buyer',
                'fieldSalesRep',
                'registrationProgram',
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
                'customerLocation',
                'webAddress',
                'learnAboutDeal',
                'preferredDistributor',
                'productionDate',
                'projectName',
                'reseller',
                'summaryOfApplication',
                'salesRep',
                'prototypeEvalDate',
                'projectType',
                'projectStatus'
            ],
            save: [
                'partnerName',
                'additionalInformation',
                'fieldSalesEngineer',
                'buyer',
                'fieldSalesRep',
                'registrationProgram',
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
                'customerLocation',
                'webAddress',
                'learnAboutDeal',
                'preferredDistributor',
                'productionDate',
                'projectName',
                'reseller',
                'summaryOfApplication',
                'prototypeEvalDate',
                'projectType',
                'projectStatus'
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

            /* ******* registration details ******* */

            number: {
                form: {
                    group: 'details',
                    type: 'text',
                    label: 'Number',
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
                    applyFunction: booleanMap
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
                    type: 'lookup',
                    label: 'Registration Program',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_reg_program',
                    type: 'object'
                }
            },

            /* ******* partner details ******* */

            partnerName: {
                form: {
                    group: 'partner',
                    type: 'lookup',
                    label: 'Partner Name',
                    required: true
                },
                record: {
                    joint: true,
                    internalid: {
                        fieldName: 'custrecord_partner_name'
                    },
                    name: {
                        fieldName: 'description',
                        joinKey: 'custrecord_partner_name'
                    }
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
                }
            },

            /* ******* end customer details ******* */

            companyName: {
                form: {
                    group: 'customer',
                    type: 'text',
                    label: 'Company Name (End Customer/OEM, ODM)',
                    labelShort: 'Company Name',
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
                    nodefault: true,
                    label: 'Country',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_company_country',
                    type: 'object',
                    applyFunction: sameIdName,
                    applySetFunction: setText
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
                    required: false
                },
                record: {
                    fieldName: 'custrecord_company_state',
                    type: 'object',
                    applyFunction: sameIdName,
                    applySetFunction: setText
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
            customerLocation: {
                form: {
                    group: 'customer',
                    type: 'text',
                    label: 'Customer Location',
                    required: false
                },
                record: {
                    fieldName: 'custrecord_customer_location'
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
            },
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
                    type: 'lookup',
                    label: 'Project Type',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_reg_project_type'
                }
            },
            projectStatus: {
                form: {
                    group: 'project',
                    type: 'lookup',
                    label: 'Project Status',
                    required: true
                },
                record: {
                    fieldName: 'custrecord_reg_project_status'
                }
            }
        }
    };
});
