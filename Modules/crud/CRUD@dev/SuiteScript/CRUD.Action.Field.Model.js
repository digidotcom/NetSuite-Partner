define('CRUD.Action.Field.Model', [
    'underscore',
    'SC.Model',
    'SearchHelper.CRUD',
    'RecordHelper.CRUD'
], function CrudActionFieldModel(
    _,
    SCModel,
    SearchHelper,
    RecordHelper
) {
    'use strict';

    return SCModel.extend({
        name: 'CRUD.Action.Field',

        run: function runActionField(config, id, action) {
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
        }
    });
});
