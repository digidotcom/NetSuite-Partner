define('Form.Lookup', [
    'underscore',
    'Form.Lookup.Collection',
    'Form.Lookup.View'
], function Form(
    _,
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
        search: function search(query) {
            var collection = new FormLookupCollection(null, {
                query: query,
                config: this.config
            });
            var view = new FormLookupView({
                collection: collection,
                application: this.application,
                config: this.config,
                fieldView: this.fieldView
            });
            collection.fetch().done(function done() {
                view.showInModal();
            });
        }
    });

    return FormLookup;
});
