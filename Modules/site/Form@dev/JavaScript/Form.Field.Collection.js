define('Form.Field.Collection', [
    'Backbone',
    'Form.Field.Model'
], function FormFieldCollection(
    Backbone,
    FormFieldModel
) {
    'use strict';

    return Backbone.Collection.extend({

        model: FormFieldModel

    });
});
