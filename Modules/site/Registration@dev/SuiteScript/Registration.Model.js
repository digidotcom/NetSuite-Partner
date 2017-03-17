define('Registration.Model', [
    'underscore',
    'SC.Model',
    'Application',
    'SearchHelper',
    'RecordHelper'
], function RegistrationModel(
    _,
    SCModel,
    Application,
    SearchHelper,
    RecordHelper
) {
    'use strict';

    function stateCountryTempMap(record, v) {
        var value = record.getFieldText(v.fieldName);
        return {
            internalid: value,
            name: value
        };
    }

    return SCModel.extend({
        name: 'Registration',

        record: 'customrecord_registrationprocess',
        columns: {
            // registration details
            internalid: { fieldName: 'internalid' },
            name: { fieldName: 'name' },
            date: { fieldName: 'created' },
            channelManager: { fieldName: 'custrecord_channel_manager', type: 'object' }, // List/Record: Employee
            internalNotes: { fieldName: 'custrecord_internal_notes' }, // Long Text
            lead: { fieldName: 'custrecord_lead' }, // Free-form Text
            opportunity: { fieldName: 'custrecord_opportunity', type: 'object' }, // List/Record: Opportunity
            salesRep: { fieldName: 'custrecord_sales_rep', type: 'object' }, // List/Record: Employee
            // partner details
            partnerName: { fieldName: 'custrecord_partner_name', type: 'object' }, // List/Record: Account
            fieldSalesEngineer: { fieldName: 'custrecord_partner_field_sales_engr', type: 'object' }, // List/Record: Contact
            buyer: { fieldName: 'custrecord_partner_buyer', type: 'object' }, // List/Record: Contact
            fieldSalesRep: { fieldName: 'custrecord_partner_field_sales_rep', type: 'object' }, // List/Record: Contact
            // end customer details
            companyName: { fieldName: 'custrecord_company_name' }, // Free-form Text
            companyMainPhone: { fieldName: 'custrecord_company_main_phone' }, // Phone Number
            companyAddress: { fieldName: 'custrecord_company_address' }, // Free-form Text
            companyAddress2: { fieldName: 'custrecord_company_address2' }, // Free-form Text
            companyCity: { fieldName: 'custrecord_company_city' }, // Free-form Text
            companyCountry: { fieldName: 'custrecord_company_country', type: 'object', applyFunction: stateCountryTempMap }, // List/Record: Country
            companyState: { fieldName: 'custrecord_company_state', type: 'object', applyFunction: stateCountryTempMap }, // List/Record: State
            companyZipCode: { fieldName: 'custrecord_country_zipcode' }, // Free-form Text
            engineerTechnicalContactEmail: { fieldName: 'custrecord_engr_contact_email' }, // Email Address
            engineerTechnicalContactName: { fieldName: 'custrecord_engr_contact_name' }, // Free-form Text
            engineerTechnicalContactPhone: { fieldName: 'custrecord_engr_contact_phone' }, // Phone Number
            customerLocation: { fieldName: 'custrecord_customer_location' }, // Free-form Text
            endCustomerAccount: { fieldName: 'custrecord_end_customer_account', type: 'object' }, // List/Record: Account
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
            { fieldName: 'isinactive', operator: 'is', value1: 'F' }
        ],
        sort: null,
        fieldsets: {
            list: [
                'internalid',
                'date',
                'name'
            ],
            details: [
                'internalid',
                'date',
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
        fields: {},

        parseListParameters: function parseListParameters() {
            var offset;

            // to-from filter
            if (this.data.from && this.data.to) {
                offset = new Date().getTimezoneOffset() * 60 * 1000;
                this.filters.push({
                    fieldName: 'created',
                    operator: 'within',
                    value1: new Date(parseInt(this.data.from, 10) + offset),
                    value2: new Date(parseInt(this.data.to, 10) + offset)
                });
            }

            // sort
            if (this.data.sort) {
                this.sort = {
                    fieldName: this.data.sort,
                    order: this.data.order >= 0 ? 'asc' : 'desc'
                };
            }
        },

        list: function list(data) {
            var search;

            this.data = data;
            this.parseListParameters();

            search = new SearchHelper()
                .setRecord(this.record)
                .setFilters(this.filters)
                .setColumns(this.columns)
                .setFieldset(this.fieldsets.list)
                .setResultsPerPage(this.data.resultsPerPage)
                .setPage(this.data.page);

            if (this.sort) {
                search
                    .setSort(this.sort.fieldName)
                    .setSortOrder(this.sort.order);
            }
            return search.search().getResultsForListHeader();
        },

        get: function get(id) {
            var record = new RecordHelper()
                .setRecord(this.record)
                .setFields(this.columns)
                .setFieldset(this.fieldsets.details);
            record.get(id);
            return record.getResult();
        }
    });
});
