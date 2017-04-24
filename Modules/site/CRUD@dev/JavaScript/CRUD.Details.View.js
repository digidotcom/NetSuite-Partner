define('CRUD.Details.View', [
    'underscore',
    'Backbone',
    'Utils',
    'Backbone.CompositeView',
    'Backbone.CollectionView',
    'Backbone.View.Multiple',
    'Mixin',
    'Form',
    'CRUD.Configuration',
    'CRUD.Lookup',
    'CRUD.Helper',
    'CRUD.AbstractView',
    'CRUD.Subrecord',
    'crud_details.tpl'
], function CrudDetailsView(
    _,
    Backbone,
    Utils,
    BackboneCompositeView,
    BackboneCollectionView,
    BackboneViewMultiple,
    Mixin,
    Form,
    CrudConfiguration,
    CrudLookup,
    CrudHelper,
    CrudAbstractView,
    CrudSubrecord,
    crudDetailsTpl
) {
    'use strict';

    /* Define base view */
    var View = CrudAbstractView.extend({

        template: crudDetailsTpl,

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
            var names = CrudHelper.getNames(this.crudId);
            return this.getTitleString(Utils.translate('New $(0)', names.singular));
        },
        getTitleSuffix: function getTitleSuffix() {
            return ' - ' + this.getTitleString();
        },
        getBreadcrumbPart: function getBreadcrumbPart() {
            var crudId = this.crudId;
            var id = this.model.get('internalid');
            var part = [
                {
                    text: this.getTitleString(null, '$(0)'),
                    href: this.isNew() ? CrudHelper.getNewUrl(crudId) : CrudHelper.getViewUrl(crudId, id)
                }
            ];
            if (this.isEdit()) {
                part.push({
                    text: Utils.translate('Edit'),
                    href: CrudHelper.getEditUrl(crudId, id)
                });
            }
            return part;
        },
        getSelectedMenu: function getSelectedMenu() {
            var baseKey = CrudHelper.getBaseKey(this.crudId);
            return this.isNew() ? baseKey + '_new' : baseKey + '_all';
        },

        initialize: function initialize(options) {
            this.crudId = options.crudId;
            this.application = options.application;
            this.model = options.model;
            this.edit = !!options.edit;
        },

        getSubrecords: function getSubrecords() {
            if (!this.subrecords) {
                this.subrecords = CrudHelper.getSubrecordsInPage(this.crudId, 'view');
            }
            return this.subrecords;
        },
        hasSubrecords: function hasSubrecords() {
            return this.getSubrecords().length > 0;
        },

        childViews: {
            'Subrecords': function Subrecord() {
                var application = this.application;
                var parentId = this.model.get('internalid');
                var subrecords = this.getSubrecords();
                var subrecordViews = [];
                _(subrecords).each(function eachSubrecord(subrecord) {
                    var view = CrudSubrecord.list(application, subrecord.crudId, parentId);
                    if (view) {
                        subrecordViews.push(view);
                    }
                });
                return new BackboneViewMultiple({
                    views: subrecordViews
                });
            }
        },

        getContext: function getContext() {
            var crudId = this.crudId;
            return {
                crudId: crudId,
                showSubrecords: this.isView() && this.hasSubrecords(),
                pageHeader: this.getPageHeader()
            };
        }
    });

    /* Add the Form mixin functionality */
    Form.add({
        target: View,
        mixinOptions: {
            formData: function formDataFn() {
                var crudId = this.crudId;
                return _.extend({}, CrudConfiguration.getForForm(crudId), {
                    lookupCallback: CrudLookup.getFetchCallback(crudId)
                });
            },

            /* Abstract methods implementation */
            getFormPermissions: function getFormPermissions() {
                var crudId = this.crudId;
                var crudPermissions = CrudHelper.getPermissions(crudId);
                var isEditEnabled = this.model.get('statusAllowsEdit');
                return {
                    list: crudPermissions.list,
                    create: crudPermissions.create,
                    view: crudPermissions.read,
                    edit: crudPermissions.update && isEditEnabled
                };
            },
            getFormInfo: function getFormInfo() {
                var crudId = this.crudId;
                var id = this.model.get('internalid');
                return {
                    title: this.getPageHeader(),
                    description: null,
                    newUrl: CrudHelper.getNewUrl(crudId),
                    editUrl: CrudHelper.getEditUrl(crudId, id),
                    viewUrl: CrudHelper.getViewUrl(crudId, id),
                    goBackUrl: CrudHelper.getListUrl(crudId)
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
