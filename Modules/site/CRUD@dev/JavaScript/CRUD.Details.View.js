define('CRUD.Details.View', [
    'underscore',
    'Backbone',
    'Utils',
    'Backbone.CompositeView',
    'Backbone.CollectionView',
    'Backbone.View.Multiple',
    'Mixin',
    'Form',
    'CRUD.Lookup',
    'CRUD.Action',
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
    CrudLookup,
    CrudAction,
    CrudHelper,
    CrudAbstractView,
    CrudSubrecord,
    crudDetailsTpl
) {
    'use strict';

    /* Define base view */
    var View = CrudAbstractView.extend({

        template: crudDetailsTpl,

        getPageHeader: function getPageHeader() {
            var names = CrudHelper.getNames(this.crudId);
            var internalid = this.model.get('internalid');
            var pageHeader;
            if (this.isNew()) {
                pageHeader = Utils.translate('New $(0)', names.singular);
            } else if (this.isEdit()) {
                pageHeader = Utils.translate('Edit $(0) #$(1)', names.singular, internalid);
            } else {
                pageHeader = Utils.translate('$(0) #$(1)', names.singular, internalid);
            }
            return pageHeader;
        },
        getTitleSuffix: function getTitleSuffix() {
            var suffix = ' - ';
            if (this.isNew()) {
                suffix += 'New';
            } else if (this.isEdit()) {
                suffix += 'Edit';
            } else {
                suffix += 'Details';
            }
            return suffix;
        },
        getBreadcrumbPart: function getBreadcrumbPart() {
            var crudId = this.crudId;
            var id = this.model.get('internalid');
            var parentId = this.parent;
            var part = [];
            if (this.isEdit()) {
                part.push({
                    text: Utils.translate('Edit'),
                    href: CrudHelper.getEditUrl(crudId, id, parentId)
                });
            } else if (this.isNew()) {
                part.push({
                    text: Utils.translate('New'),
                    href: CrudHelper.getNewUrl(crudId, parentId)
                });
            }
            return part;
        },

        initialize: function initialize(options) {
            this.crudId = options.crudId;
            this.parent = options.parent;
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

        getGoBackUrl: function getGoBackUrl() {
            var crudId = this.crudId;
            var parentId = this.parent;
            if (parentId) {
                return CrudHelper.getParentUrlWithSubrecord(crudId, parentId);
            }
            return CrudHelper.getListUrl(crudId, parentId);
        },
        getNewSubrecordName: function getNewSubrecordUrl() {
            var crudId = this.crudId;
            var subrecord = CrudHelper.getFirstSubrecord(crudId);
            var names;
            if (subrecord && subrecord.crudId) {
                names = CrudHelper.getNames(subrecord.crudId);
                if (names) {
                    if (names.inContextSingular) {
                        return names.inContextSingular;
                    } else if (names.singular) {
                        return names.singular;
                    }
                }
            }
            return null;
        },
        getNewSubrecordUrl: function getNewSubrecordUrl(id) {
            var crudId = this.crudId;
            var subrecord = CrudHelper.getFirstSubrecord(crudId);
            if (subrecord) {
                return CrudHelper.getUrlForPage('new', subrecord.crudId, null, id);
            }
            return null;
        },
        getNewSaveRedirectUrl: function getNewSaveRedirectUrl(id) {
            var parentId = this.parent;
            if (parentId) {
                return this.getGoBackUrl();
            }
            return this.getNewSubrecordUrl(id);
        },
        getNewSaveRedirectUrlCallback: function getNewSaveRedirectUrlCallback() {
            var self = this;
            return function callback(id) {
                return self.getNewSaveRedirectUrl(id);
            };
        },

        childViews: {
            'Subrecords': function Subrecord() {
                var application = this.application;
                var model = this.model;
                var parentId = model.get('internalid');
                var subrecords = this.getSubrecords();
                var subrecordViews = [];
                _(subrecords).each(function eachSubrecord(subrecord) {
                    var subrecordCrudId = subrecord.crudId;
                    var view = CrudSubrecord.list(application, subrecordCrudId, parentId, model);
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
                var parentId = this.parent;
                return _.extend({}, CrudHelper.getConfigForForm(crudId), {
                    lookupPromiseCallback: CrudLookup.getPromiseCallback(crudId, parentId),
                    actionPromiseCallback: CrudAction.getPromiseCallback(crudId, parentId)
                });
            },

            /* Abstract methods implementation */
            isFormAsync: function isFormAsync() {
                var crudId = this.crudId;
                var page = this.getFormAction();
                return CrudHelper.isFormAsync(crudId, page);
            },
            getFormPermissions: function getFormPermissions() {
                var crudId = this.crudId;
                var crudPermissions = CrudHelper.getPermissions(crudId);
                var isEditEnabled = CrudHelper.isEditEnabledForModel(crudId, this.model);
                return {
                    list: crudPermissions.list,
                    create: crudPermissions.create,
                    view: crudPermissions.read,
                    edit: crudPermissions.update && isEditEnabled
                };
            },
            getFormInfo: function getFormInfo() {
                var crudId = this.crudId;
                var parentId = this.parent;
                var id = this.model.get('internalid');
                var labels = {};
                var subrecordName = this.getNewSubrecordName();
                if (subrecordName) {
                    labels.add = Utils.translate('Add $(0)', subrecordName);
                }
                return {
                    title: this.getPageHeader(),
                    description: null,
                    newUrl: CrudHelper.getNewUrl(crudId, parentId),
                    editUrl: CrudHelper.getEditUrl(crudId, id, parentId),
                    viewUrl: CrudHelper.getViewUrl(crudId, id, parentId),
                    lists: CrudHelper.getListsForForm(crudId),
                    goBackUrl: this.getGoBackUrl(),
                    showAddAndNew: !!parentId,
                    getNewSaveRedirectUrl: this.getNewSaveRedirectUrlCallback(),
                    actionLabels: labels,
                    customActions: CrudHelper.getActionsForForm(crudId, {
                        page: this.getFormAction(),
                        model: this.model
                    })
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
