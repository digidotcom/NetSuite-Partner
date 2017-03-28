define('Registration.Model', [
    'underscore',
    'SC.Model',
    'Application',
    'Models.Init',
    'SearchHelper',
    'RecordHelper.CRUD'
], function RegistrationModel(
    _,
    SCModel,
    Application,
    ModelsInit,
    SearchHelper
) {
    'use strict';

    function stateCountryTempMap(line, v) {
        var value = line.getText(v.fieldName);
        return {
            internalid: value,
            name: value
        };
    }
    function booleanMap(line, v) {
        return line.getValue(v.fieldName) === 'T';
    }

    return SCModel.extend({
        name: 'Registration',

        record: 'customrecord_registrationprocess',
        columns: {
            // registration details
            internalid: { fieldName: 'internalid' },
            name: { fieldName: 'name' }, // Free-form Text
            date: { fieldName: 'created' }, // Date
            statusId: { fieldName: 'custrecord_registration_status' }, // List/Record: Registration Status
            statusName: { fieldName: 'custrecord_registration_status_public', joinKey: 'custrecord_registration_status' },  // List/Record: Registration Status
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
            partnerName: { // List/Record: Account
                fieldName: 'description',
                joinKey: 'custrecord_partner_name'
            },
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
            { fieldName: 'isinactive', operator: 'is', value1: 'F' },
            { fieldName: 'custrecord_partner_customer', operator: 'is', value1: nlapiGetUser() }
        ],
        filtersDynamic: {
            status: { fieldName: 'custrecord_registration_status', operator: 'is', numberOfValues: 1 }
        },
        joinFields: {
            status: { idField: 'statusId', nameField: 'statusName' },
            partnerName: { idField: 'partnerId', nameField: 'partnerName' }
        },
        sort: null,
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
                'partnerId',
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
            var self = this;
            var data = this.data;

            // page number
            if (!data.page) {
                data.page = 1;
            }

            // to-from filter
            if (data.from && data.to) {
                offset = new Date().getTimezoneOffset() * 60 * 1000;
                self.filters.push({
                    fieldName: 'created',
                    operator: 'within',
                    value1: new Date(parseInt(data.from, 10) + offset),
                    value2: new Date(parseInt(data.to, 10) + offset)
                });
            }

            // filters
            if (data.filters) {
                _(self.filtersDynamic).each(function eachFilterWhitelist(filter, paramName) {
                    var filterObject;
                    var value;
                    if (paramName in data.filters) {
                        value = data.filters[paramName];
                        filterObject = {
                            fieldName: filter.fieldName || paramName,
                            operator: filter.operator || 'is'
                        };
                        if (filter.numberOfValues && filter.numberOfValues === 2) {
                            value = value.split(',');
                            filterObject.value1 = value[0];
                            filterObject.value2 = value[1];
                        } else {
                            filterObject.value1 = value;
                        }
                        self.filters.push(filterObject);
                    }
                });
            }

            // sort
            if (data.sort) {
                self.sort = {
                    fieldName: data.sort,
                    order: data.order >= 0 ? 'asc' : 'desc'
                };
            }
        },

        parseJoinObject: function parseJoinObject(result, fieldset) {
            _(this.joinFields).each(function eachJoinObject(joinField, key) {
                var idField = joinField.idField;
                var nameField = joinField.nameField;
                var fields = [idField, nameField];
                var joined;
                // if all joinedFields are in fieldset, join them
                if (_.intersection(fieldset, fields).length === fields.length) {
                    joined = {
                        internalid: result[idField],
                        name: result[nameField]
                    };
                    delete result[idField];
                    delete result[nameField];
                    result[key] = joined;
                }
            });
        },
        mapResult: function mapResult(result, fieldset) {
            this.parseJoinObject(result, fieldset);
        },
        mapResults: function mapResults(results, fieldset) {
            var self = this;
            _(results).each(function reachResult(result) {
                self.mapResult(result, fieldset);
            });
        },

        list: function list(data) {
            var search;
            var results;
            var fieldset = this.fieldsets.list;

            this.data = data;
            this.parseListParameters();

            search = new SearchHelper()
                .setRecord(this.record)
                .setFilters(this.filters)
                .setColumns(this.columns)
                .setFieldset(fieldset)
                .setResultsPerPage(this.data.resultsPerPage)
                .setPage(this.data.page);

            if (this.sort) {
                search
                    .setSort(this.sort.fieldName)
                    .setSortOrder(this.sort.order);
            }
            results = search.search().getResultsForListHeader();
            this.mapResults(results.records, fieldset);
            return results;
        },

        get: function get(id) {
            var search;
            var result;
            var fieldset = this.fieldsets.details;

            this.filters.push({ fieldName: 'internalid', operator: 'is', value1: id });

            search = new SearchHelper()
                .setRecord(this.record)
                .setFilters(this.filters)
                .setColumns(this.columns)
                .setFieldset(fieldset);

            result = search.search().getResult();
            this.mapResult(result, fieldset);
            return result;
        },

        create: function create(data) {
            console.log('create', JSON.stringify(data));
            return 1;
        },

        update: function update(id, data) {
            console.log('update id: ' + id, JSON.stringify(data));
        }
    });
});
