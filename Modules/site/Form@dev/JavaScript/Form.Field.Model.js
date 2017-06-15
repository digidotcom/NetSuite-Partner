define('Form.Field.Model', [
    'Backbone'
], function FormFieldModel(
    Backbone
) {
    'use strict';

    return Backbone.Model.extend({

        isInline: function isInline() {
            return !!this.get('inline');
        },
        isHiddenType: function isHiddenType() {
            return this.get('type') === 'hidden';
        }

    });
});
