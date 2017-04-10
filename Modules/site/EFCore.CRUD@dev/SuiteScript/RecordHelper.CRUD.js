define('RecordHelper.CRUD', [
    'underscore',
    'RecordHelper'
], function RecordHelperDefine(
    _,
    RecordHelper
) {
    'use strict';

    function RecordHelperCrud(record, fields, fieldset, data) {
        RecordHelper.apply(this, _(arguments).toArray());
        this.setData(data || {});
    }

    /* extend from RecordHelper */
    RecordHelperCrud.prototype = Object.create(RecordHelper.prototype);

    /* eslint-disable no-underscore-dangle */
    _(RecordHelperCrud.prototype).extend({

        setData: function setData(data) {
            this._data = _.clone(data);
            return this;
        },

        _setFieldToRecord: function _setFieldToRecord(fieldInfo, value) {
            var record = this._recordObj;
            var fieldName = fieldInfo.fieldName;

            switch (fieldInfo.type) {
            case 'listrecordToObject':
            case 'file':
            case 'object':
                record.setFieldValue(fieldName, value);
                break;

            case 'objects':
            case 'getValues':
            case 'values':
                record.setFieldValues(fieldName, value);
                break;

            case 'getText':
            case 'text':
                record.setFieldText(fieldName, value);
                break;

            case 'getTexts':
            case 'texts':
                record.setFieldTexts(fieldName, value);
                break;

            default:
                record.setFieldValue(fieldName, value);
                break;
            }

            if (fieldInfo.applySetFunction) {
                fieldInfo.applySetFunction(record, fieldInfo, value);
            }
        },

        _setDataToRecord: function _setDataToRecord() {
            var self = this;
            var data = this._data;
            var fields = this._fields;

            _(data).each(function eachData(value, fieldId) {
                var fieldInfo = _(fields).find(function findProps(info, columnId) {
                    return columnId === fieldId;
                });

                if (fieldInfo && !fieldInfo.joinKey) {
                    if (self._fieldset && !_.contains(self._fieldset, fieldId)) {
                        return;
                    }

                    self._setFieldToRecord(fieldInfo, value, fieldId);
                }
            });
        },

        _save: function save(optionsArg) {
            var options = optionsArg || {};
            this._setDataToRecord();
            this._lastResultCrud = nlapiSubmitRecord(
                this._recordObj,
                options.doSourcing || null,
                options.ignoreMandatoryFields || null
            );
            return this;
        },

        create: function create(options) {
            this._recordObj = nlapiCreateRecord(this._record);
            this._save(options);
            return this;
        },

        update: function update(id, options) {
            this._recordObj = nlapiLoadRecord(this._record, id);
            this._save(options);
            return this;
        },

        'delete': function deleteFn(id) {
            this._lastResultCrud = nlapiDeleteRecord(this._record, id);
            return this;
        },

        getResult: function getResult() {
            if (this._lastResultCrud) {
                return this._lastResultCrud;
            }
            return RecordHelper.prototype.getResult.call(this);
        }

    });
    /* eslint-enable no-underscore-dangle */

    return RecordHelperCrud;
});
