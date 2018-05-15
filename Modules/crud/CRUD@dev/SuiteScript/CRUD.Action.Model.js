define('CRUD.Action.Model', [
    'underscore',
    'SC.Model',
    'SearchHelper.CRUD',
    'RecordHelper.CRUD',
    'CRUD.Utils',
    'CRUD.Configuration',
    'CRUD.Action.Field.Model',
    'CRUD.Action.Convert.Model'
], function CrudActionModel(
    _,
    SCModel,
    SearchHelper,
    RecordHelper,
    CrudUtils,
    CrudConfiguration,
    CrudActionFieldModel,
    CrudActionConvertModel
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

        getActionModel: function getActionModel(type) {
            switch (type) {
            case 'field':
                return CrudActionFieldModel;
            case 'convert':
                return CrudActionConvertModel;
            default:
            }
            return null;
        },

        runActionExecute: function runAction(config, id, action) {
            var model = this.getActionModel(action.type);
            if (model) {
                return model.run(config, id, action);
            }
            return false;
        },

        runActionExecutes: function runActions(config, id, actionConfig, resultsArray) {
            var self = this;
            resultsArray = resultsArray || []; // eslint-disable-line no-param-reassign
            return _(actionConfig.execute).every(function eachAction(action) {
                var result = self.runActionExecute(config, id, action);
                resultsArray.push(result);
                return !!result;
            });
        },

        parseActionsResponse: function parseResultResponse(actionConfig, executeResults) {
            return _({}).extend(actionConfig.result || {}, {
                resultData: executeResults
            });
        },

        run: function update(crudId, id, actionName) {
            var config = CrudConfiguration.getForRecord(crudId);
            var actionConfig = this.getActionData(config, actionName);

            var resultsArray = [];
            var result = this.runActionExecutes(config, id, actionConfig, resultsArray);

            if (result) {
                return this.parseActionsResponse(actionConfig, resultsArray);
            }
            return null;
        }
    });
});
