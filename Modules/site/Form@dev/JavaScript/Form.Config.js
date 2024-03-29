define('Form.Config', [
    'underscore',
    'jQuery',
    'Form.Group.Collection',
    'Form.Field.Collection'
], function FormConfigModule(
    _,
    jQuery,
    FormGroupCollection,
    FormFieldCollection
) {
    'use strict';

    var defaults = {
        application: null,
        model: null,
        permissions: {},
        info: {},
        id: null,
        action: 'view'
    };

    function FormConfig(settings) {
        this.defaults = defaults;
        this.config = _(settings).defaults(defaults);
        this.application = this.config.application;
        this.model = this.config.model;
        this.parseConfig();
    }

    _(FormConfig.prototype).extend({

        getConfig: function getDataJSON() {
            return this.config;
        },
        getAction: function getAction() {
            return this.config.action;
        },
        getData: function getData() {
            return this.config.data;
        },
        getDataJSON: function getData() {
            return this.config.dataJSON;
        },
        getPermissions: function getPermissions() {
            return this.config.permissions;
        },
        setPermissions: function setPermissions(permissions) {
            this.config.permissions = permissions;
        },
        getInfo: function getInfo() {
            return this.config.info;
        },
        setInfo: function getInfo(info) {
            this.config.info = info;
        },
        setData: function setData(data) {
            this.config.data = data;
            this.parseConfig();
        },

        isLoading: function isLoading() {
            return !!this.isLoadingFlag;
        },
        setLoading: function setLoading(isLoading) {
            this.isLoadingFlag = isLoading;
        },

        getFieldDisplaySuffix: function getFieldDisplaySuffix() {
            return '_display';
        },
        getFieldDisplay: function getFieldDisplaySuffix(field) {
            return field + this.getFieldDisplaySuffix();
        },
        isNew: function isNew() {
            return this.getAction() === 'new';
        },
        isEdit: function isEdit() {
            return this.getAction() === 'edit';
        },
        isView: function isView() {
            return this.getAction() === 'view';
        },

        canList: function canList() {
            return !!this.getPermissions().list;
        },
        canCreate: function canCreate() {
            return !!this.getPermissions().create;
        },
        canView: function canView() {
            return !!this.getPermissions().view;
        },
        canEdit: function canEdit() {
            return !!this.getPermissions().edit;
        },

        canAccess: function canAccess() {
            return (this.isNew() && this.canCreate()) ||
                   (this.isView() && this.canView()) ||
                   (this.isEdit() && this.canEdit());
        },

        getLists: function getLists() {
            return this.getInfo().lists;
        },

        getDependentFields: function getDependentFields(attribute) {
            var data = this.getDataJSON();
            var dependentFields = this.dependentFields;
            if (!dependentFields) {
                dependentFields = {};
                _(data.fields).each(function filterField(field) {
                    var relatedAttribute = field.relatedAttribute;
                    if (relatedAttribute) {
                        if (!(relatedAttribute in dependentFields)) {
                            dependentFields[relatedAttribute] = [];
                        }
                        dependentFields[relatedAttribute].push(field.attribute);
                    }
                });
                this.dependentFields = dependentFields;
            }
            if (attribute) {
                if (attribute in dependentFields) {
                    return dependentFields[attribute];
                }
                return [];
            }
            return dependentFields;
        },

        parseConfig: function parseData() {
            var self = this;
            var config = this.getConfig();
            var data = config.data;
            var dataJSON;
            var ungroupedGroup = { fields: [] };
            var hashTemp = {};
            data.groups = data.groups || [];
            dataJSON = jQuery.extend(true, {}, data);
            _(dataJSON.groups).each(function eachGroup(groupJSON, i) {
                var groupData = data.groups[i];
                groupData.fields = new FormFieldCollection(null, { config: self });
                groupJSON.fields = [];
                hashTemp[groupJSON.id || ''] = { data: groupData, json: groupJSON };
            });
            _(dataJSON.fields).each(function eachField(fieldJSON) {
                var groupId = fieldJSON.group || '';
                if (hashTemp[groupId]) {
                    hashTemp[groupId].data.fields.add(fieldJSON);
                    hashTemp[groupId].json.fields.push(fieldJSON);
                } else {
                    ungroupedGroup.fields.push(fieldJSON);
                }
            });
            if (ungroupedGroup.fields.length > 0) {
                dataJSON.groups.unshift(ungroupedGroup);
                data.groups.unshift({ fields: new FormFieldCollection(ungroupedGroup.fields, { config: self }) });
            }
            config.dataJSON = dataJSON;
            data.groups = new FormGroupCollection(data.groups);
            delete data.fields;
        },

        hasRequiredFields: function hasRequiredFields() {
            return !!_(this.getDataJSON().fields).findWhere({ required: true });
        }

    });

    return FormConfig;
});
