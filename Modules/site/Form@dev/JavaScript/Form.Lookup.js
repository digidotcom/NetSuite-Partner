define('Form.Lookup', [
    'underscore',
    'jQuery',
    'Form.Lookup.Collection',
    'Form.Lookup.View'
], function Form(
    _,
    jQuery,
    FormLookupCollection,
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
            var query = queryOriginal ? queryOriginal.toLowerCase() : '';
            var collection = new FormLookupCollection(null, {
                config: this.config
            });
            var view = new FormLookupView({
                collection: collection,
                application: this.application,
                config: this.config,
                query: queryOriginal,
                fieldView: this.fieldView
            });
            collection.fetch({
                data: {
                    q: query,
                    field: field
                }
            }).done(function done() {
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
