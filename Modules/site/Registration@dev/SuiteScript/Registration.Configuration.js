define('Registration.Configuration', [
    'underscore'
], function RegistrationConfiguration(
    _
) {
    'use strict';

    return {

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
        getForForm: function getForBootstrapping() {
            return {
                groups: this.getWithKeySet(this.groups, this.keySets.groups.bootstrapping),
                fields: this.getWithKeySet(this.fields, this.keySets.fields.bootstrapping)
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
        ]
    };
});
