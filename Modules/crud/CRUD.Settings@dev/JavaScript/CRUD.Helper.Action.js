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
        getFilteredActions: function getActionsForPage(crudId, data) {
            var self = this;
            var actions = this.getActions(crudId);
            return _(actions).filter(function filterActions(action) {
                if (action.conditions && action.conditions.length) {
                    return self.areConditionsMet(action.conditions, data);
                }
                return true;
            });
        },
        getActionInfo: function getActionInfo(crudId, data, actionName) {
            var actions = this.getFilteredActions(crudId, data);
            return _(actions).findWhere({ name: actionName });
        },
        isActionStatic: function isActionSubmit(actionInfo) {
            return actionInfo.execute === 'static';
        },
        isActionNameStatic: function isActionNameSubmit(crudId, data, actionName) {
            var action = this.getActionInfo(crudId, data, actionName);
            return action && this.isActionStatic(action);
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
