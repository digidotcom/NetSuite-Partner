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
                { id: 'main', name: 'Registration Details' },
                { id: 'information', name: 'Information' }
            ],
            fields: {
                name: {
                    group: 'main',
                    type: 'text',
                    attribute: 'name',
                    label: 'Name',
                    required: true
                },
                email: {
                    group: 'main',
                    type: 'email',
                    attribute: 'email',
                    label: 'Email',
                    required: false
                },
                phone: {
                    group: 'main',
                    type: 'tel',
                    attribute: 'phone',
                    label: 'Phone',
                    required: true
                },
                age: {
                    group: 'main',
                    type: 'number',
                    attribute: 'age',
                    label: 'Age',
                    required: true
                },
                website: {
                    group: 'main',
                    type: 'url',
                    attribute: 'website',
                    label: 'Web Site',
                    required: true
                },
                dob: {
                    group: 'main',
                    type: 'date',
                    attribute: 'dob',
                    label: 'Date Of Birth',
                    required: true
                },
                additionalInformation: {
                    group: 'information',
                    type: 'longtext',
                    attribute: 'additionalInformation',
                    label: 'Additional Information',
                    required: true
                },
                companyName: {
                    group: 'information',
                    type: 'text',
                    attribute: 'companyName',
                    label: 'Company Name',
                    required: true
                },
                test: {
                    group: 'information',
                    type: 'text',
                    attribute: 'companyAddress',
                    label: 'Company Address',
                    required: true
                }
            }
        },

        /* Abstract methods implementation */
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
