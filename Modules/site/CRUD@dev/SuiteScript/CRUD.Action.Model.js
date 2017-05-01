define('CRUD.Action.Model', [
    'underscore',
    'SC.Model',
    'SearchHelper',
    'RecordHelper.CRUD',
    'CRUD.Utils',
    'CRUD.Configuration'
], function CrudActionModel(
    _,
    SCModel,
    SearchHelper,
    RecordHelper,
    CrudUtils,
    CrudConfiguration
) {
    'use strict';

    return SCModel.extend({
        name: 'CRUD.Action',

        getActionData: function getActionData(config, actionName) {
            var actions = config && config.actions;
            var action = _(actions).findWhere({ name: actionName });
            if (!action) {
                throw badRequestError;
            }
            return action;
        },

        runActionField: function runActionField(config, id, action) {
            var record;
            var data = {};
            data[action.fieldName] = action.value;
            record = new RecordHelper()
                .setRecord(config.record)
                .setFields(config.columns)
                .setData(data)
                .setFilters(config.filters);
            record.update(id);
            return !!record.getResult();
        },

        runAction: function runAction(config, id, action) {
            switch (action.type) {
            case 'field':
                return this.runActionField(config, id, action);
            default:
            }
            return false;
        },

        run: function update(crudId, id, actionName) {
            var self = this;
            var config = CrudConfiguration.getForRecord(crudId);
            var actionConfig = this.getActionData(config, actionName);

            var result = _(actionConfig.execute).every(function eachAction(action) {
                return self.runAction(config, id, action);
            });

            if (result) {
                return actionConfig.result;
            }
            return null;
        }
    });
});
