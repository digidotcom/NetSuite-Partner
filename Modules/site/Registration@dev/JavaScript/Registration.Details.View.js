define('Registration.Details.View', [
    'underscore',
    'Backbone',
    'Utils',
    'Backbone.CompositeView',
    'Registration.Helper',
    'Registration.AbstractView',
    'registration_details.tpl'
], function RegistrationDetailsView(
    _,
    Backbone,
    Utils,
    BackboneCompositeView,
    RegistrationHelper,
    RegistrationAbstractView,
    registrationDetailsTpl
) {
    'use strict';

    return RegistrationAbstractView.extend({

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

        events: {},

        initialize: function initialize(options) {
            this.application = options.application;
            this.model = options.model;
            this.edit = !!options.edit;

            BackboneCompositeView.add(this);
        },

        isNew: function isNew() {
            return !this.model.get('internalid');
        },
        isEdit: function isEdit() {
            return this.edit;
        },
        isView: function isView() {
            return !this.isNew() && !this.isEdit();
        },

        childViews: {},

        getContext: function getContext() {
            return {
                pageHeader: this.getPageHeader()
            };
        }
    });
});
