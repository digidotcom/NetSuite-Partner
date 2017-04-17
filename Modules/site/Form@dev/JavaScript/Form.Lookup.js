define('Form.Lookup', [
    'underscore',
    'jQuery',
    'Form.Lookup.View'
], function Form(
    _,
    jQuery,
    FormLookupView
) {
    'use strict';

    function FormLookup(options) {
        this.fieldView = options.fieldView;
        this.application = options.application;
        this.config = options.config;
    }

    _(FormLookup.prototype).extend({
        search: function search(field, queryOriginal) {
            var lookupCallback = this.config.getData().lookupCallback;
            var query = queryOriginal ? queryOriginal.toLowerCase() : '';
            var view = new FormLookupView({
                application: this.application,
                config: this.config,
                query: queryOriginal,
                fieldView: this.fieldView
            });
            lookupCallback({
                field: field,
                query: query
            }).done(function done(collection) {
                view.collection = collection;
                if (collection.length === 1) {
                    view.setSelectedModel(collection.at(0));
                    view.handleLookupResponse();
                } else {
                    view.showInModal();
                }
            });
        }
    });

    return FormLookup;
});
