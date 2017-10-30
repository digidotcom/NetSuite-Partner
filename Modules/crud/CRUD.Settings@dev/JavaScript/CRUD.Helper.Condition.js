define('CRUD.Helper.Condition', [
    'underscore'
], function CrudHelperCondition(
    _
) {
    'use strict';

    return {
        isConditionPageMet: function isConditionPageMet(condition, page) {
            return !condition.values || (_.indexOf(condition.values, page) >= 0);
        },
        isConditionFieldMet: function isConditionField(condition, model) {
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
        isConditionMet: function isConditionMet(condition, data) {
            if (condition) {
                switch (condition.type) {
                case 'page':
                    return this.isConditionPageMet(condition, data.page);
                case 'field':
                    return this.isConditionFieldMet(condition, data.model);
                default:
                }
            }
            return false;
        },
        areConditionsMet: function areConditionsMet(conditions, data) {
            var self = this;
            if (conditions && conditions.length) {
                return _(conditions).every(function everyCondition(condition) {
                    return self.isConditionMet(condition, data);
                });
            }
            return true;
        }
    };
});
