define('Registration.Details.View', [
    'underscore',
    'Backbone',
    'Utils',
    'Backbone.CompositeView',
    'Registration.AbstractView',
    'registration_details.tpl'
], function RegistrationDetailsView(
    _,
    Backbone,
    Utils,
    BackboneCompositeView,
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
            var part = [
                {
                    text: this.getTitleString(null, '$(0)'),
                    href: this.getUrl()
                }
            ];
            if (this.isEdit()) {
                part.push({
                    text: Utils.translate('Edit'),
                    href: this.getUrl(true)
                });
            }
            return part;
        },
        getUrl: function getUrl(edit) {
            return '/registrations' + (this.isNew() ? '/new' : ('/' + (edit ? 'edit' : 'view') + '/' + this.model.get('internalid')));
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
