define('Form.Field.Model', [
    'Backbone'
], function FormFieldModel(
    Backbone
) {
    'use strict';

    return Backbone.Model.extend({

        getConfig: function getConfig() {
            return this.collection && this.collection.config;
        },
        isHideField: function isHideField() {
            var config = this.getConfig();
            var isNew = config && config.isNew();
            return isNew && this.isInline() && this.isEmpty();
        },
        isEmpty: function isEmpty() {
            var config = this.getConfig();
            var attribute = this.get('attribute');
            return config && !config.model.get(attribute);
        },
        isInline: function isInline() {
            return !!this.get('inline');
        },
        isHiddenType: function isHiddenType() {
            return this.get('type') === 'hidden';
        }

    });
});
