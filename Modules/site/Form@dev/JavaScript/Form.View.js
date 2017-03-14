define('Form.View', [
    'Backbone',
    'Backbone.CompositeView',
    'form.tpl'
], function FormView(
    Backbone,
    BackboneCompositeView,
    formTpl
) {
    'use strict';

    return Backbone.View.extend({

        template: formTpl,

        initialize: function initialize(options) {
            console.log(options);
            BackboneCompositeView.add(this);
        }

    });
});
