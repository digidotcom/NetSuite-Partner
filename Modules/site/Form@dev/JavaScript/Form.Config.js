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
        data: {},
        action: 'view'
    };

    function FormConfig(settings) {
        this.defaults = defaults;
        this.config = _(settings).defaults(defaults);
        this.application = this.config.application;
        this.parseConfig();
    }

    _(FormConfig.prototype).extend({

        getConfig: function getDataJSON() {
            return this.config;
        },
        getData: function getData() {
            return this.config.data;
        },
        getAction: function getAction() {
            return this.config.action;
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
            _(dataJSON.groups).each(function eachFn(groupJSON, i) {
                var fields = _(dataJSON.fields).where({
                    group: groupJSON.id
                });
                data.groups[i].fields = new FormFieldCollection(fields);
                groupJSON.fields = fields;
            });
            config.dataJSON = dataJSON;
            data.groups = new FormGroupCollection(data.groups);
            delete data.fields;
        }

    });

    return FormConfig;
});
