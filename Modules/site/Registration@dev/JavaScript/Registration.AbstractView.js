define('Registration.AbstractView', [
    'underscore',
    'Backbone',
    'Utils'
], function RegistrationAbstractView(
    _,
    Backbone,
    Utils
) {
    'use strict';

    return Backbone.View.extend({

        getSelectedMenu: function getSelectedMenu() {
            return 'registrations';
        },
        getTitle: function getTitle() {
            return Utils.translate('Registrations') + this.getTitleSuffix();
        },
        getBreadcrumbPages: function getBreadcrumbPages() {
            return _.union([
                {
                    text: this.title,
                    href: '/registrations'
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
