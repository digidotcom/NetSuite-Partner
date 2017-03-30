define('Registration.Details.View', [
    'underscore',
    'Backbone',
    'Utils',
    'Backbone.CompositeView',
    'Mixin',
    'Form',
    'Registration.Helper',
    'Registration.AbstractView',
    'registration_details.tpl'
], function RegistrationDetailsView(
    _,
    Backbone,
    Utils,
    BackboneCompositeView,
    Mixin,
    Form,
    RegistrationHelper,
    RegistrationAbstractView,
    registrationDetailsTpl
) {
    'use strict';

    /* Define base view */
    var View = RegistrationAbstractView.extend({

        template: registrationDetailsTpl,

        getTitleString: function getTitleString(newStr, editStr) {
            var title;
            if (this.isNew()) {
                title = Utils.translate(newStr || 'New');
            } else if (this.isEdit()) {
                title = Utils.translate(editStr || '$(0) - Edit', this.model.get('name'));
            } else {
                title = this.model.get('name');
            }
            return title;
        },
        getPageHeader: function getPageHeader() {
            return this.getTitleString('New Registration');
        },
        getTitleSuffix: function getTitleSuffix() {
            return ' - ' + this.getTitleString();
        },
        getBreadcrumbPart: function getBreadcrumbPart() {
            var id = this.model.get('internalid');
            var part = [
                {
                    text: this.getTitleString(null, '$(0)'),
                    href: this.isNew() ? RegistrationHelper.getNewUrl() : RegistrationHelper.getViewUrl(id)
                }
            ];
            if (this.isEdit()) {
                part.push({
                    text: Utils.translate('Edit'),
                    href: RegistrationHelper.getEditUrl(id)
                });
            }
            return part;
        },
        getSelectedMenu: function getSelectedMenu() {
            return this.isNew() ? 'registrations_new' : 'registrations_all';
        },

        initialize: function initialize(options) {
            this.application = options.application;
            this.model = options.model;
            this.edit = !!options.edit;
        },

        getContext: function getContext() {
            return {
                pageHeader: this.getPageHeader()
            };
        }
    });

    /* Add the Form mixin functionality */
    Form.add(View);

    /* Implement the Form abstract methods */
    _(View.prototype).extend({

        formData: {
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
        },

        /* Abstract methods implementation */
        getFormPermissions: function getFormPermissions() {
            var crudPermissions = RegistrationHelper.getCrudPermissions();
            var isEditEnabled = this.model.get('statusAllowsEdit');
            return {
                list: crudPermissions.list,
                create: crudPermissions.create,
                view: crudPermissions.read,
                edit: crudPermissions.update && isEditEnabled
            };
        },
        getFormInfo: function getFormInfo() {
            var id = this.model.get('internalid');
            return {
                title: this.getPageHeader(),
                description: null,
                newUrl: RegistrationHelper.getNewUrl(),
                editUrl: RegistrationHelper.getEditUrl(id),
                viewUrl: RegistrationHelper.getViewUrl(id),
                goBackUrl: RegistrationHelper.getListUrl()
            };
        },
        isNew: function isNew() {
            return !this.model.get('internalid');
        },
        isEdit: function isEdit() {
            return this.edit;
        }

    });

    return View;
});
