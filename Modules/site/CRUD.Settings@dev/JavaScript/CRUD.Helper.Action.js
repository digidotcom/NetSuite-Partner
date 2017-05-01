define('CRUD.Helper.Action', [
    'underscore',
    'Utils',
    'CRUD.Configuration'
], function CrudHelperAction(
    _,
    Utils,
    CrudConfiguration
) {
    'use strict';

    return {
        getActionServiceUrl: function getActionServiceUrl(crudId, absolute) {
            var url = CrudConfiguration.get(crudId).actionServiceUrl;
            return absolute ? Utils.getAbsoluteUrl(url) : url;
        },
        getActions: function getActions(crudId) {
            return CrudConfiguration.get(crudId).actions || [];
        },
        isActionConditionPage: function isActionConditionPage(condition, page) {
            return !condition.values || (_.indexOf(condition.values, page) >= 0);
        },
        isActionConditionField: function isActionConditionField(condition, model) {
            var fieldName = condition.fieldName;
            var values = condition.values;
            var value;
            if (model && fieldName) {
                value = model.get(fieldName);
                if (values && values.length) {
                    return _.indexOf(values, value) >= 0;
                }
                return !value;
            }
            return false;
        },
        isActionConditionMet: function isActionConditionMet(condition, data) {
            if (condition) {
                switch (condition.type) {
                case 'page':
                    return this.isActionConditionPage(condition, data.page);
                case 'field':
                    return this.isActionConditionField(condition, data.model);
                default:
                }
            }
            return false;
        },
        areActionConditionsMet: function isActionConditionMet(action, data) {
            var self = this;
            if (action.conditions && action.conditions.length) {
                return _(action.conditions).every(function everyCondition(condition) {
                    return self.isActionConditionMet(condition, data);
                });
            }
            return true;
        },
        getFilteredActions: function getActionsForPage(crudId, data) {
            var self = this;
            var actions = this.getActions(crudId);
            return _(actions).filter(function filterActions(action) {
                return self.areActionConditionsMet(action, data);
            });
        },
        getActionsForForm: function getActionsForForm(crudId, data) {
            var actions = this.getFilteredActions(crudId, data);
            return _(actions).map(function mapActions(action) {
                return {
                    name: action.name,
                    label: action.label
                };
            });
        }
    };
});
