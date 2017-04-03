define('Registration.Details.View', [
    'underscore',
    'Backbone',
    'Utils',
    'Backbone.CompositeView',
    'Mixin',
    'CRUD.Configuration',
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
    CrudConfiguration,
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
    Form.add({
        target: View,
        mixinOptions: {
            formData: CrudConfiguration.getForForm(RegistrationHelper.crudId),

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
        }
    });

    return View;
});
