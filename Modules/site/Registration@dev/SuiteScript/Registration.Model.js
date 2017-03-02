define('Registration.Model', [
    'underscore',
    'SC.Model',
    'Application',
    'SearchHelper'
], function RegistrationModel(
    _,
    SCModel,
    Application,
    SearchHelper
) {
    'use strict';

    return SCModel.extend({
        name: 'Registration',

        record: 'customrecord_registrationprocess',
        columns: {
            internalid: { fieldName: 'internalid' },
            name: { fieldName: 'name' },
            partnerName: { fieldName: 'custrecord_partner_name', type: 'object' }, // List/Record: Account
            additionalInformation: { fieldName: 'custrecord_additional_information' }, // Long Text
            fieldSalesEngineer: { fieldName: 'custrecord_partner_field_sales_engr', type: 'object' }, // List/Record: Contact
            buyer: { fieldName: 'custrecord_partner_buyer', type: 'object' }, // List/Record: Contact
            fieldSalesRep: { fieldName: 'custrecord_partner_field_sales_rep', type: 'object' }, // List/Record: Contact
            companyName: { fieldName: 'custrecord_company_name' }, // Free-form Text
            companyMainPhone: { fieldName: 'custrecord_company_main_phone', type: 'text' }, // Phone Number
            companyAddress: { fieldName: 'custrecord_company_address' }, // Free-form Text
            companyAddress2: { fieldName: 'custrecord_company_address2' }, // Free-form Text
            companyCity: { fieldName: 'custrecord_company_city' }, // Free-form Text
            companyCountry: { fieldName: 'custrecord_company_country', type: 'text' }, // List/Record: Country
            companyState: { fieldName: 'custrecord_company_state', type: 'text' }, // List/Record: State
            companyZipCode: { fieldName: 'custrecord_country_zipcode' }, // Free-form Text
            contractManufacturer: { fieldName: 'custrecord_contract_manufacturer' }, // Free-form Text
            developmentDesignConsultant: { fieldName: 'custrecord_development_design_consultant' }, // Free-form Text
            engineerTechnicalContactEmail: { fieldName: 'custrecord_engr_contact_email', type: 'text' }, // Email Address
            engineerTechnicalContactName: { fieldName: 'custrecord_engr_contact_name' }, // Free-form Text
            engineerTechnicalContactPhone: { fieldName: 'custrecord_engr_contact_phone', type: 'text' }, // Phone Number
            channelManager: { fieldName: 'custrecord_channel_manager', type: 'object' }, // List/Record: Employee
            customerLocation: { fieldName: 'custrecord_customer_location' }, // Free-form Text
            endCustomerAccount: { fieldName: 'custrecord_end_customer_account', type: 'object' }, // List/Record: Account
            learnAboutDeal: { fieldName: 'custrecord_learn_about_deal' }, // Long Text
            internalNotes: { fieldName: 'custrecord_internal_notes' }, // Long Text
            lead: { fieldName: 'custrecord_lead' }, // Free-form Text
            opportunity: { fieldName: 'custrecord_opportunity', type: 'object' }, // List/Record: Opportunity
            preferredDistributor: { fieldName: 'custrecord_preferred_distributor' }, // Free-form Text
            productionDate: { fieldName: 'custrecord_production_date', type: 'text' }, // Date
            projectName: { fieldName: 'custrecord_project_name' }, // Free-form Text
            reseller: { fieldName: 'custrecord_reseller' }, // Free-form Text
            summaryOfApplication: { fieldName: 'custrecord_summary_of_application' }, // Long Text
            salesRep: { fieldName: 'custrecord_sales_rep', type: 'object' }, // List/Record: Employee
            prototypeEvalDate: { fieldName: 'custrecord_prototype_eval_date', type: 'text' } // Date
        },
        filters: [
            { fieldName: 'isinactive', operator: 'is', value1: 'F' }
        ],
        fieldsets: {
            list: [
                'internalid',
                'name'
            ],
            details: [
                'internalid',
                'name',
                'partnerName',
                'additionalInformation',
                'fieldSalesEngineer',
                'buyer',
                'fieldSalesRep',
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
                'endCustomerAccount',
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
        },
        fieldGroups: {
            registrationDetails: 'Registration Details',
            partnerDetails: 'Partner Details',
            endCustomerDetails: 'End Customer Details',
            supplyChain: 'Supply Chain',
            projectDetails: 'Project Details'
        },
        fields: {

        },

        list: function list() {
            var Search = new SearchHelper(this.record, this.filters, this.columns, this.fieldsets.list);
            return {
                records: Search.search().getResults()
            };
        }
    });
});
