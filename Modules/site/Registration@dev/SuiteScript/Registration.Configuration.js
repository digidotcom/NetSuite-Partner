define('Registration.Configuration', [
    'underscore'
], function RegistrationConfiguration(
    _
) {
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

    return {

        crudId: 'registration',

        keySets: {
            fields: {
                bootstrapping: [
                    'group',
                    'type',
                    'attribute',
                    'label',
                    'required',
                    'inline',
                    'help',
                    'tooltip',
                    'list',
                    'relatedAttribute',
                    'nodefault'
                ]
            },
            groups: {
                bootstrapping: [
                    'id',
                    'name'
                ]
            }
        },

        getWithKeySet: function getWithKeySet(configs, keySet) {
            return _(configs).map(function mapFields(config) {
                return _(config).pick(keySet);
            });
        },
        getForCrud: function getForBootstrapping() {
            return {
                groups: this.getWithKeySet(this.groups, this.keySets.groups.bootstrapping),
                fields: this.getWithKeySet(this.fields, this.keySets.fields.bootstrapping),
                record: this.record
            };
        },

        groups: [
            { id: 'details', name: 'Registration Details' },
            { id: 'partner', name: 'Partner Details' },
            { id: 'customer', name: 'End Customer Details' },
            { id: 'supply', name: 'Supply Chain' },
            { id: 'project', name: 'Project Details' }
        ],
        fields: [
            {
                group: 'details',
                type: 'text',
                attribute: 'name',
                label: 'Name',
                required: true
            },
            {
                group: 'details',
                type: 'list',
                attribute: 'status',
                label: 'Status',
                inline: true,
                required: true
            },
            {
                group: 'details',
                type: 'datetime',
                attribute: 'approvalDate',
                label: 'Approval Date',
                inline: true,
                required: true
            },
            {
                group: 'details',
                type: 'datetime',
                attribute: 'expiryDate',
                label: 'Expiry Date',
                inline: true,
                required: true
            },
            {
                group: 'details',
                type: 'lookup',
                attribute: 'channelManager',
                label: 'Channel Manager',
                help: 'Example: Doe, John',
                required: false
            },
            {
                group: 'details',
                type: 'text',
                attribute: 'lead',
                label: 'Lead',
                required: false
            },
            {
                group: 'details',
                type: 'lookup',
                attribute: 'opportunity',
                label: 'Opportunity',
                required: false
            },
            {
                group: 'details',
                type: 'lookup',
                attribute: 'salesRep',
                label: 'Sales Rep',
                required: false
            },
            {
                group: 'partner',
                type: 'lookup',
                attribute: 'partnerName',
                label: 'Partner Name',
                required: true
            },
            {
                group: 'partner',
                type: 'lookup',
                attribute: 'fieldSalesEngineer',
                label: 'Partner Field Sales Engineer',
                required: true
            },
            {
                group: 'partner',
                type: 'lookup',
                attribute: 'buyer',
                label: 'Partner Buyer',
                required: false
            },
            {
                group: 'partner',
                type: 'lookup',
                attribute: 'fieldSalesRep',
                label: 'Partner Field Sales Rep',
                required: true
            },
            {
                group: 'customer',
                type: 'text',
                attribute: 'companyName',
                label: 'Company Name (End Customer/OEM, ODM)',
                required: true
            },
            {
                group: 'customer',
                type: 'phone',
                attribute: 'companyMainPhone',
                label: 'Main Phone',
                required: true
            },
            {
                group: 'customer',
                type: 'text',
                attribute: 'companyAddress',
                label: 'Address',
                required: false
            },
            {
                group: 'customer',
                type: 'text',
                attribute: 'companyAddress2',
                label: 'Address 2',
                required: false
            },
            {
                group: 'customer',
                type: 'text',
                attribute: 'companyCity',
                label: 'City',
                required: true
            },
            {
                group: 'customer',
                type: 'list',
                list: 'countries',
                nodefault: true,
                attribute: 'companyCountry',
                label: 'Country',
                required: true
            },
            {
                group: 'customer',
                type: 'list',
                list: 'states',
                relatedAttribute: 'companyCountry',
                nodefault: false,
                attribute: 'companyState',
                label: 'State',
                tooltip: 'Depends on the selected country',
                required: false
            },
            {
                group: 'customer',
                type: 'number',
                attribute: 'companyZipCode',
                label: 'Zip/Postal Code',
                required: true
            },
            {
                group: 'customer',
                type: 'email',
                attribute: 'engineerTechnicalContactEmail',
                label: 'Engineer/Technical Contact Email',
                required: true
            },
            {
                group: 'customer',
                type: 'text',
                attribute: 'engineerTechnicalContactName',
                label: 'Engineer/Technical Contact Name',
                required: true
            },
            {
                group: 'customer',
                type: 'phone',
                attribute: 'engineerTechnicalContactPhone',
                label: 'Engineer/Technical Contact Phone',
                required: true
            },
            {
                group: 'customer',
                type: 'text',
                attribute: 'customerLocation',
                label: 'Customer Location',
                required: false
            },
            {
                group: 'customer',
                type: 'lookup',
                attribute: 'endCustomerAccount',
                label: 'End Customer Account',
                required: false
            },
            {
                group: 'supply',
                type: 'text',
                attribute: 'contractManufacturer',
                label: 'Contract Manufacturer',
                required: false
            },
            {
                group: 'supply',
                type: 'text',
                attribute: 'developmentDesignConsultant',
                label: 'Development/Design Consultant',
                required: false
            },
            {
                group: 'supply',
                type: 'text',
                attribute: 'preferredDistributor',
                label: 'Preferred Distributor',
                required: false
            },
            {
                group: 'supply',
                type: 'text',
                attribute: 'reseller',
                label: 'Reseller',
                required: false
            },
            {
                group: 'project',
                type: 'longtext',
                attribute: 'additionalInformation',
                label: 'Additional Information',
                required: false
            },
            {
                group: 'project',
                type: 'longtext',
                attribute: 'learnAboutDeal',
                label: 'How did you learn about this deal?',
                required: true
            },
            {
                group: 'project',
                type: 'date',
                attribute: 'productionDate',
                label: 'Production Date',
                required: true
            },
            {
                group: 'project',
                type: 'text',
                attribute: 'projectName',
                label: 'Project Name',
                required: true
            },
            {
                group: 'project',
                type: 'longtext',
                attribute: 'summaryOfApplication',
                label: 'Summary Of Application',
                required: true
            },
            {
                group: 'project',
                type: 'date',
                attribute: 'prototypeEvalDate',
                label: 'Prototype/Eval Date',
                required: true
            }
        ],

        record: {
            record: 'customrecord_registrationprocess',
            columns: {
                // registration details
                internalid: { fieldName: 'internalid' },
                name: { fieldName: 'name' }, // Free-form Text
                date: { fieldName: 'created' }, // Date

                statusId: { fieldName: 'custrecord_registration_status' }, // List/Record: Registration Status
                statusName: { // List/Record: Registration Status
                    fieldName: 'custrecord_registration_status_public',
                    joinKey: 'custrecord_registration_status'
                },

                statusAllowsEdit: {
                    fieldName: 'custrecord_registration_status_edit',
                    joinKey: 'custrecord_registration_status',
                    applyFunction: booleanMap
                },  // Checkbox
                approvalDate: { fieldName: 'custrecord_registration_approval_date' }, // Date
                expiryDate: { fieldName: 'custrecord_registration_expiry_date' }, // Date
                channelManager: { fieldName: 'custrecord_channel_manager', type: 'object' }, // List/Record: Employee
                lead: { fieldName: 'custrecord_lead' }, // Free-form Text
                opportunity: { fieldName: 'custrecord_opportunity', type: 'object' }, // List/Record: Opportunity
                salesRep: { fieldName: 'custrecord_sales_rep', type: 'object' }, // List/Record: Employee
                // partner details
                customer: { fieldName: 'custrecord_partner_customer', type: 'object' },

                partnerId: { fieldName: 'custrecord_partner_name' }, // List/Record: Account
                partnerName: { fieldName: 'description', joinKey: 'custrecord_partner_name' },  // List/Record: Account

                fieldSalesEngineerId: { fieldName: 'custrecord_partner_field_sales_engr' }, // List/Record: Contact
                fieldSalesEngineerName: { fieldName: 'entityid', joinKey: 'custrecord_partner_field_sales_engr' }, // List/Record: Contact

                buyerId: { fieldName: 'custrecord_partner_buyer' }, // List/Record: Contact
                buyerName: { fieldName: 'entityid', joinKey: 'custrecord_partner_buyer' }, // List/Record: Contact

                fieldSalesRepId: { fieldName: 'custrecord_partner_field_sales_rep' }, // List/Record: Contact
                fieldSalesRepName: { fieldName: 'entityid', joinKey: 'custrecord_partner_field_sales_rep' }, // List/Record: Contact

                // end customer details
                companyName: { fieldName: 'custrecord_company_name' }, // Free-form Text
                companyMainPhone: { fieldName: 'custrecord_company_main_phone' }, // Phone Number
                companyAddress: { fieldName: 'custrecord_company_address' }, // Free-form Text
                companyAddress2: { fieldName: 'custrecord_company_address2' }, // Free-form Text
                companyCity: { fieldName: 'custrecord_company_city' }, // Free-form Text
                companyCountry: { fieldName: 'custrecord_company_country', type: 'object', applyFunction: sameIdName }, // List/Record: Country
                companyState: { fieldName: 'custrecord_company_state', type: 'object', applyFunction: sameIdName }, // List/Record: State
                companyZipCode: { fieldName: 'custrecord_country_zipcode' }, // Free-form Text
                engineerTechnicalContactEmail: { fieldName: 'custrecord_engr_contact_email' }, // Email Address
                engineerTechnicalContactName: { fieldName: 'custrecord_engr_contact_name' }, // Free-form Text
                engineerTechnicalContactPhone: { fieldName: 'custrecord_engr_contact_phone' }, // Phone Number
                customerLocation: { fieldName: 'custrecord_customer_location' }, // Free-form Text

                endCustomerAccountId: { fieldName: 'custrecord_end_customer_account' }, // List/Record: Account
                endCustomerAccountName: { fieldName: 'description', joinKey: 'custrecord_end_customer_account' }, // List/Record: Account

                // supply chain
                contractManufacturer: { fieldName: 'custrecord_contract_manufacturer' }, // Free-form Text
                developmentDesignConsultant: { fieldName: 'custrecord_development_design_consultant' }, // Free-form Text
                preferredDistributor: { fieldName: 'custrecord_preferred_distributor' }, // Free-form Text
                reseller: { fieldName: 'custrecord_reseller' }, // Free-form Text
                // project details
                additionalInformation: { fieldName: 'custrecord_additional_information' }, // Long Text
                learnAboutDeal: { fieldName: 'custrecord_learn_about_deal' }, // Long Text
                productionDate: { fieldName: 'custrecord_production_date' }, // Date
                projectName: { fieldName: 'custrecord_project_name' }, // Free-form Text
                summaryOfApplication: { fieldName: 'custrecord_summary_of_application' }, // Long Text
                prototypeEvalDate: { fieldName: 'custrecord_prototype_eval_date' } // Date
            },
            filters: [
                { fieldName: 'isinactive', operator: 'is', value1: 'F' },
                { fieldName: 'custrecord_partner_customer', operator: 'is', value1: nlapiGetUser() }
            ],
            filtersDynamic: {
                status: { fieldName: 'custrecord_registration_status', operator: 'is', numberOfValues: 1 }
            },
            joinFields: {
                status: { idField: 'statusId', nameField: 'statusName' },
                partnerName: { idField: 'partnerId', nameField: 'partnerName' },
                fieldSalesEngineer: { idField: 'fieldSalesEngineerId', nameField: 'fieldSalesEngineerName' },
                buyer: { idField: 'buyerId', nameField: 'buyerName' },
                fieldSalesRep: { idField: 'fieldSalesRepId', nameField: 'fieldSalesRepName' },
                endCustomerAccount: { idField: 'endCustomerAccountId', nameField: 'endCustomerAccountName' }
            },
            fieldsets: {
                list: [
                    'internalid',
                    'date',
                    'name',
                    'statusId',
                    'statusName',
                    'statusAllowsEdit',
                    'approvalDate',
                    'expiryDate',
                    'companyName',
                    'partnerId',
                    'partnerName'
                ],
                details: [
                    'internalid',
                    'date',
                    'name',
                    'statusId',
                    'statusName',
                    'statusAllowsEdit',
                    'approvalDate',
                    'expiryDate',
                    'partnerId',
                    'partnerName',
                    'additionalInformation',
                    'fieldSalesEngineerId',
                    'fieldSalesEngineerName',
                    'buyerId',
                    'buyerName',
                    'fieldSalesRepId',
                    'fieldSalesRepName',
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
                    'endCustomerAccountId',
                    'endCustomerAccountName',
                    'learnAboutDeal',
                    'internalNotes',
                    'lead',
                    'opportunity',
                    'preferredDistributor',
                    'productionDate',
                    'projectName',
                    'reseller',
                    'summaryOfApplication',
                    'salesRep',
                    'prototypeEvalDate'
                ]
            }
        }
    };
});
