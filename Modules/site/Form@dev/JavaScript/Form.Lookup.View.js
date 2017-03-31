define('Form.Lookup.View', [
    'Backbone',
    'form_lookup.tpl'
], function FormLookupView(
    Backbone,
    formLookupTpl
) {
    'use strict';

    return Backbone.View.extend({

        template: formLookupTpl,

        initialize: function initialize(options) {
            this.collection = options.collection;
            this.application = options.application;
            this.config = options.config;
            this.fieldView = options.fieldView;
        },

        destroy: function destroy() {
            var result = this._destroy();
            this.fieldView.handleLookupResponse(this.selectedModel);
            return result;
        },

        getContext: function getContext() {
            this.selectedModel = this.collection.at(0);
            return {
                query: this.selectedModel.get('query')
            };
        }

    });
});
