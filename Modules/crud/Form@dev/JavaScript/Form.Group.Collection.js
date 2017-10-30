define('Form.Group.Collection', [
    'Backbone',
    'Form.Group.Model'
], function FormFieldsFieldCollection(
    Backbone,
    FormGroupModel
) {
    'use strict';

    return Backbone.Collection.extend({

        model: FormGroupModel

    });
});
