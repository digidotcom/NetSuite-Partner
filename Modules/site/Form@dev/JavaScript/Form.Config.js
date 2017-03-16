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
        info: {},
        data: {},
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
        getInfo: function getInfo() {
            return this.config.info;
        },
        setInfo: function getInfo(info) {
            this.config.info = info;
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

        parseConfig: function parseData() {
            var config = this.getConfig();
            var data = config.data;
            var dataJSON = jQuery.extend(true, {}, data);
            var ungroupedGroup = { fields: [] };
            var hashTemp = {};
            _(dataJSON.groups).each(function eachGroup(groupJSON, i) {
                var groupData = data.groups[i];
                groupData.fields = new FormFieldCollection();
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
                data.groups.unshift({ fields: new FormFieldCollection(ungroupedGroup.fields) });
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
