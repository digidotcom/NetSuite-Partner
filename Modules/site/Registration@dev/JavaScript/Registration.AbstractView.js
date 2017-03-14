define('Registration.AbstractView', [
    'underscore',
    'Backbone',
    'Utils',
    'Registration.Helper'
], function RegistrationAbstractView(
    _,
    Backbone,
    Utils,
    RegistrationHelper
) {
    'use strict';

    return Backbone.View.extend({

        getSelectedMenu: function getSelectedMenu() {
            return 'registrations_all';
        },
        getTitle: function getTitle() {
            return Utils.translate('Registrations') + this.getTitleSuffix();
        },
        getBreadcrumbPages: function getBreadcrumbPages() {
            return _.union([
                {
                    text: Utils.translate('Registrations'),
                    href: RegistrationHelper.getListUrl()
                }
            ], this.getBreadcrumbPart());
        },

        /* Abstract methods or attributes to be implemented by children */
        titleSuffix: '',
        breadcrumbPart: [],
        getTitleSuffix: function getTitleSuffix() {
            return this.titleSuffix || '';
        },
        getBreadcrumbPart: function getBreadcrumbPart() {
            return this.breadcrumbPart || [];
        }
    });
});
