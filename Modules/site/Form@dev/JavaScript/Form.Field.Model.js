define('Form.Field.Model', [
    'Backbone'
], function FormFieldModel(
    Backbone
) {
    'use strict';

    return Backbone.Model.extend({

        isHiddenType: function isHiddenType() {
            return this.get('type') === 'hidden';
        }

    });
});
